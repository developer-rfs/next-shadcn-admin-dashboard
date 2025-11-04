"use client";

import Image from "next/image";
import Link from "next/link";

import { Sidebar, SidebarContent, SidebarHeader } from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";

import { NavMain } from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props} className="border-r bg-[#d4d4d4] text-slate-900">
      <SidebarHeader className="border-b border-[#bfbfbf] px-6 py-8">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image
            src="https://ddf-backend-static.s3.amazonaws.com/prod/static/images/logo.png"
            alt="DDF - Daily Dog Fights logo"
            width={64}
            height={64}
            className="rounded-xl bg-white/80 p-2 shadow-sm"
            priority
          />
          <span className="text-lg leading-tight font-semibold">{APP_CONFIG.name}</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6">
        <NavMain items={sidebarItems} />
      </SidebarContent>
    </Sidebar>
  );
}
