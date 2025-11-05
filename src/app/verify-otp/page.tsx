"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import { VerifyOtpForm } from "@/app/(main)/auth/_components/verify-otp-form";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") ?? "";

  useEffect(() => {
    if (!email) {
      router.replace("/register");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  const decodedEmail = useMemo(() => decodeURIComponent(email), [email]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <Image
            src="https://ddf-backend-static.s3.amazonaws.com/prod/static/images/logo.png"
            alt="DDF - Daily Dog Fights logo"
            width={80}
            height={80}
            className="rounded-2xl bg-gray-100 p-3"
            priority
          />
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold">Verify Your Account</h1>
            <p className="text-sm text-muted-foreground">
              Enter the code we sent to <span className="font-medium text-slate-900">{decodedEmail}</span>. The code
              expires after 5 minutes.
            </p>
          </div>
        </div>
        <VerifyOtpForm email={decodedEmail} />
      </div>
    </div>
  );
}
