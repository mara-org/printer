import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SignInForm } from "@/components/sign-in-form";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabaseServer } from "@/lib/supabase-server";

export const metadata = {
  title: "Sign in — PaperLens",
  description: "Sign in to PaperLens with Google or a one-time email link.",
};

export default async function SignInPage() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user) redirect("/upload");

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <CardDescription>
              Continue with Google, or get a one-time link by email.
            </CardDescription>
          </CardHeader>
          <CardBody className="space-y-4">
            <Suspense fallback={null}>
              <GoogleSignInButton />
            </Suspense>
            <div className="flex items-center gap-3 text-xs text-ink/40">
              <span className="h-px flex-1 bg-ink/10" />
              <span>or</span>
              <span className="h-px flex-1 bg-ink/10" />
            </div>
            <Suspense fallback={null}>
              <SignInForm />
            </Suspense>
          </CardBody>
        </Card>
      </main>
      <Footer />
    </>
  );
}
