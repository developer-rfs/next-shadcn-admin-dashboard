"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type NavGroup } from "@/navigation/sidebar/sidebar-items";

interface NavMainProps {
  readonly items: readonly NavGroup[];
}

export function NavMain({ items }: NavMainProps) {
  const path = usePathname();

  return (
    <>
      {items.map((group) => (
        <SidebarGroup key={group.id}>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive =
                  path === item.url ||
                  (item.url !== "/dashboard" && path.startsWith(item.url)) ||
                  (item.url === "/dashboard" && path === "/dashboard");

                return (
                  <SidebarMenuItem key={item.title} className="border-b border-[#bfbfbf] last:border-b-0">
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="justify-start gap-3 rounded-md px-5 py-4 text-[15px] font-medium hover:bg-white/70 data-[active=true]:bg-white data-[active=true]:text-slate-900"
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon className="size-5" />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  );
}
