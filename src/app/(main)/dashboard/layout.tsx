import { ReactNode } from "react";

import { DashboardShell } from "@/app/(main)/dashboard/_components/dashboard-shell";
import { rootUser } from "@/data/users";

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const user = rootUser;

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
