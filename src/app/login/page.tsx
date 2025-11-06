"use client";

import Image from "next/image";
import Link from "next/link";

import { LoginForm } from "@/app/(main)/auth/_components/login-form";
import { GoogleButton } from "@/app/(main)/auth/_components/social-auth/google-button";

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
            <h1 className="text-3xl font-semibold">Welcome to DDF</h1>
            <p className="text-muted-foreground text-base">
              Welcome back, let&apos;s get you back in the game.
            </p>
          </div>
        </div>
        <LoginForm />
        {/* <GoogleButton className="w-full" variant="outline" /> */}
        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-slate-900 hover:underline">
            Sign up now &rarr;
          </Link>
        </p>
      </div>
    </div>
  );
}
