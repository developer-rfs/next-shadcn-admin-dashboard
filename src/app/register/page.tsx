"use client";

import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "@/app/(main)/auth/_components/register-form";

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
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
            <h1 className="text-2xl font-semibold">Register</h1>
            <p className="text-muted-foreground text-sm">Create an account to access your dashboard.</p>
          </div>
        </div>
        <RegisterForm />
        <p className="text-muted-foreground text-center text-xs">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline-offset-4 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
