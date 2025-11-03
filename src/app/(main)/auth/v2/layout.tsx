import { ReactNode } from "react";

import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full rounded-3xl lg:flex">
          <div className="text-primary-foreground absolute top-10 space-y-2 px-10">
            <Image
              src="https://ddf-backend-static.s3.amazonaws.com/prod/static/images/logo.png"
              alt="DDF - Daily Dog Fights logo"
              width={64}
              height={64}
              className="rounded-lg bg-white/10 p-3"
              priority
            />
            <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
            <p className="text-sm">Daily ops, dog fights, and scheduling under one mission control.</p>
          </div>

          <div className="absolute bottom-10 flex w-full justify-between px-10">
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Ready to launch?</h2>
              <p className="text-sm">Configure brackets, publish schedules, and track every match in minutes.</p>
            </div>
            <Separator orientation="vertical" className="mx-3 !h-auto" />
            <div className="text-primary-foreground flex-1 space-y-1">
              <h2 className="font-medium">Need support?</h2>
              <p className="text-sm">Reach out to the crew for assistance or plug into the upcoming API toolkit.</p>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
