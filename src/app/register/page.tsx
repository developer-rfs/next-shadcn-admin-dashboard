"use client";

import Image from "next/image";
import Link from "next/link";

import { RegisterForm } from "@/app/(main)/auth/_components/register-form";

export default function Page() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col gap-6">
          <div className="flex justify-center">
            <Image
              src="https://ddf-backend-static.s3.amazonaws.com/prod/static/images/logo.png"
              alt="DDF - Daily Dog Fights logo"
              width={80}
              height={80}
              className="rounded-2xl bg-gray-100 p-3"
              priority
            />
          </div>
          <div className="space-y-2 text-left">
            <h1 className="text-3xl font-semibold">Register</h1>
            <p className="text-muted-foreground text-base">Create your director account to get started.</p>
          </div>
        </div>
        <RegisterForm />
        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-slate-900 hover:underline">
            Login &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
