import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UploadForm } from "@/components/upload-form";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata = {
  title: "Upload — PaperLens",
  description: "Upload a document and get a plain-language explanation in seconds.",
};

export default function UploadPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Upload a document</h1>
          <p className="text-ink/60">
            We&apos;ll explain it in plain language and flag the risky parts. Free for your first
            3 documents this month.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>New analysis</CardTitle>
            <CardDescription>
              Lease, contract, insurance, medical bill, tax letter — anything official.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <UploadForm />
          </CardBody>
        </Card>
      </main>
      <Footer />
    </>
  );
}
