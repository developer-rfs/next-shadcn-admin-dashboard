"use client";

import { ReactNode, useMemo } from "react";

import Image from "next/image";
import Link from "next/link";

import { PageHeader, PageHeaderProvider, usePageHeader } from "@/app/(main)/dashboard/_components/page-header";
import { AppSidebar } from "@/app/(main)/dashboard/_components/sidebar/app-sidebar";
import { ThemeSwitcher } from "@/app/(main)/dashboard/_components/sidebar/theme-switcher";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type DashboardShellProps = {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  children: ReactNode;
};

function HeaderBar({ user }: { user: DashboardShellProps["user"] }) {
  const { state } = usePageHeader();
  const { actions } = state;

  const actionContent = useMemo(() => {
    if (!actions) return null;
    return <div className="flex items-center gap-3">{actions}</div>;
  }, [actions]);

  return (
    <header className="flex flex-col gap-4 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      <PageHeader />
      <div className="flex items-center gap-4">
        {actionContent}
        <ThemeSwitcher />
        <div className="flex items-center gap-3">
          <Image
            src={user.avatar || "/avatars/arhamkhnz.png"}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full border object-cover"
          />
          <div className="text-right">
            <p className="text-sm leading-none font-medium">Welcome {user.name}</p>
            <Link href="/login" className="text-muted-foreground hover:text-foreground text-xs">
              Sign Out
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background flex min-h-screen flex-1 flex-col">
        <PageHeaderProvider>
          <HeaderBar user={user} />
          <main className="flex-1 overflow-auto px-6 py-8">{children}</main>
        </PageHeaderProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
