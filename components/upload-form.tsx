"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Turnstile } from "@/components/turnstile";
import { cn } from "@/lib/utils";

const MAX_BYTES = 20 * 1024 * 1024;
const ACCEPTED = "application/pdf,image/jpeg,image/png,image/webp,image/heic,image/heif";

type Stage = "idle" | "uploading" | "analyzing" | "error" | "done";

const LOCALES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt-br", label: "Português (BR)" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
];

export function UploadForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [locale, setLocale] = useState("en");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const onDrop = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > MAX_BYTES) {
      setError("File is too large. Maximum is 20 MB.");
      return;
    }
    setError(null);
    setFile(f);
  }, []);

  async function submit() {
    if (!file) return;
    setError(null);
    setStage("uploading");
    try {
      // 1. Get a signed upload URL.
      const urlRes = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          mime_type: file.type || "application/pdf",
          byte_size: file.size,
        }),
      });
      if (!urlRes.ok) {
        const j = await urlRes.json().catch(() => ({}));
        throw new Error(j.error ?? "could not get upload URL");
      }
      const { storage_path, signed_url } = (await urlRes.json()) as {
        storage_path: string;
        signed_url: string;
      };

      // 2. Upload file to Supabase Storage.
      const putRes = await fetch(signed_url, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/pdf" },
        body: file,
      });
      if (!putRes.ok) throw new Error(`upload failed (${putRes.status})`);

      // 3. Trigger analysis.
      setStage("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storage_path,
          output_locale: locale,
          turnstile_token: turnstileToken,
        }),
      });
      if (!analyzeRes.ok) {
        const j = await analyzeRes.json().catch(() => ({}));
        throw new Error(j.error ?? `analyze failed (${analyzeRes.status})`);
      }
      const { document_id } = (await analyzeRes.json()) as { document_id: string };

      // 4. Go to result.
      setStage("done");
      router.push(`/a/${document_id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "upload failed");
      setStage("error");
    }
  }

  const busy = stage === "uploading" || stage === "analyzing";

  return (
    <div className="space-y-6">
      <label
        htmlFor="file"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          onDrop(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition",
          drag
            ? "border-accent bg-accent/5"
            : "border-ink/15 bg-white hover:border-ink/30",
        )}
      >
        <input
          id="file"
          type="file"
          accept={ACCEPTED}
          className="sr-only"
          onChange={(e) => onDrop(e.target.files)}
          disabled={busy}
        />
        {file ? (
          <div className="space-y-1">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-ink/50">
              {(file.size / 1024 / 1024).toFixed(2)} MB · click to change
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Drop a document here, or click to choose</p>
            <p className="text-xs text-ink/50">PDF, JPG, PNG, WEBP, HEIC · up to 20 MB</p>
          </div>
        )}
      </label>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <label className="text-sm text-ink/70">
          Explain in:
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            disabled={busy}
            className="ml-2 rounded-lg border border-ink/15 bg-white px-2 py-1 text-sm focus:border-accent focus:outline-none"
          >
            {LOCALES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <Turnstile onToken={setTurnstileToken} />
      </div>

      <Button
        onClick={submit}
        disabled={!file || !turnstileToken || busy}
        size="lg"
        className="w-full"
      >
        {stage === "uploading" ? (
          <>
            <Spinner /> Uploading…
          </>
        ) : stage === "analyzing" ? (
          <>
            <Spinner /> Analyzing…
          </>
        ) : (
          "Analyze document"
        )}
      </Button>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}
