"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";

type SidebarContextValue = {
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

type SidebarProviderProps = {
  children: React.ReactNode;
  className?: string;
  defaultOpen?: boolean;
};

export function SidebarProvider({ children, className }: SidebarProviderProps) {
  return (
    <SidebarContext.Provider value={{ isMobile: false }}>
      <div className={cn("flex min-h-screen w-full", className)}>{children}</div>
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const value = React.useContext(SidebarContext);
  if (!value) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return value;
}

export const Sidebar = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Sidebar(
  { className, ...props },
  ref,
) {
  return (
    <aside
      ref={ref}
      className={cn("flex min-h-full w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground", className)}
      {...props}
    />
  );
});

export const SidebarInset = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarInset({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex min-h-screen flex-1 flex-col", className)} {...props} />;
  },
);

export const SidebarHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarHeader({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-4 py-4", className)} {...props} />;
  },
);

export const SidebarContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("flex-1 overflow-y-auto px-3 py-4", className)} {...props} />;
  },
);

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarFooter({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-4 py-4", className)} {...props} />;
  },
);

export const SidebarGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroup({ className, ...props }, ref) {
    return <div ref={ref} className={cn("space-y-2", className)} {...props} />;
  },
);

export const SidebarGroupContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroupContent({ className, ...props }, ref) {
    return <div ref={ref} className={cn("space-y-1", className)} {...props} />;
  },
);

export const SidebarGroupLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarGroupLabel({ className, ...props }, ref) {
    return <div ref={ref} className={cn("px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground", className)} {...props} />;
  },
);

export const SidebarMenu = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function SidebarMenu({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("flex flex-col gap-1", className)} {...props} />;
  },
);

export const SidebarMenuItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  function SidebarMenuItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn("list-none", className)} {...props} />;
  },
);

type SidebarMenuButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isActive?: boolean;
};

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  function SidebarMenuButton({ asChild, className, isActive, ...props }, ref) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-active={isActive ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-white/60 data-[active=true]:bg-white data-[active=true]:text-slate-900",
          className,
        )}
        {...props}
      />
    );
  },
);

export const SidebarMenuAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SidebarMenuAction({ className, ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn("rounded-sm border border-sidebar-border px-2 py-1 text-xs transition-colors hover:bg-white/70", className)}
        {...props}
      />
    );
  },
);

export const SidebarMenuBadge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  function SidebarMenuBadge({ className, ...props }, ref) {
    return (
      <span
        ref={ref}
        className={cn("ml-auto rounded-md bg-sidebar-accent px-2 py-1 text-[11px] font-medium text-sidebar-accent-foreground", className)}
        {...props}
      />
    );
  },
);

export const SidebarMenuSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function SidebarMenuSkeleton({ className, ...props }, ref) {
    return <div ref={ref} className={cn("h-10 w-full animate-pulse rounded-md bg-sidebar/60", className)} {...props} />;
  },
);

export const SidebarMenuSub = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  function SidebarMenuSub({ className, ...props }, ref) {
    return <ul ref={ref} className={cn("ml-4 flex flex-col gap-1 border-l border-sidebar-border pl-4", className)} {...props} />;
  },
);

export const SidebarMenuSubItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  function SidebarMenuSubItem({ className, ...props }, ref) {
    return <li ref={ref} className={cn("list-none", className)} {...props} />;
  },
);

type SidebarMenuSubButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  isActive?: boolean;
};

export const SidebarMenuSubButton = React.forwardRef<HTMLButtonElement, SidebarMenuSubButtonProps>(
  function SidebarMenuSubButton({ asChild, className, isActive, ...props }, ref) {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-active={isActive ? "true" : undefined}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-white/40 data-[active=true]:bg-white data-[active=true]:text-slate-900",
          className,
        )}
        {...props}
      />
    );
  },
);

export const SidebarSeparator = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  function SidebarSeparator({ className, ...props }, ref) {
    return <hr ref={ref} className={cn("my-2 border-t border-sidebar-border", className)} {...props} />;
  },
);

export const SidebarRail: React.FC = () => null;

export const SidebarTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  function SidebarTrigger({ className, ...props }, ref) {
    return <button ref={ref} type="button" className={cn("hidden", className)} {...props} />;
  },
);
