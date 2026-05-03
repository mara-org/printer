import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SignInForm } from "@/components/sign-in-form";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { supabaseServer } from "@/lib/supabase-server";

export const metadata = {
  title: "Sign in — PaperLens",
  description: "Sign in to PaperLens with a one-time link to your email.",
};

export default async function SignInPage() {
  const sb = supabaseServer();
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
              Enter your email and we&apos;ll send a one-time sign-in link.
            </CardDescription>
          </CardHeader>
          <CardBody>
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
