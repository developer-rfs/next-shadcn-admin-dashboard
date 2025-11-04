"use client";

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";

type HeaderState = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

const DEFAULT_HEADER: HeaderState = {
  title: "Dashboard",
};

type PageHeaderContextValue = {
  state: HeaderState;
  setHeader: (value: HeaderState) => void;
  resetHeader: () => void;
};

const PageHeaderContext = createContext<PageHeaderContextValue | null>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HeaderState>(DEFAULT_HEADER);
  const setHeader = useCallback((value: HeaderState) => setState(value), []);
  const resetHeader = useCallback(() => setState(DEFAULT_HEADER), []);

  const value = useMemo<PageHeaderContextValue>(
    () => ({
      state,
      setHeader,
      resetHeader,
    }),
    [resetHeader, setHeader, state],
  );

  return <PageHeaderContext.Provider value={value}>{children}</PageHeaderContext.Provider>;
}

export function usePageHeader() {
  const context = useContext(PageHeaderContext);
  if (!context) {
    throw new Error("usePageHeader must be used within a PageHeaderProvider.");
  }
  return context;
}

export function usePageHeaderConfig(config: HeaderState) {
  const { setHeader, resetHeader } = usePageHeader();

  useEffect(() => {
    setHeader(config);
    return () => {
      resetHeader();
    };
  }, [config, resetHeader, setHeader]);
}

export function PageHeader() {
  const { state } = usePageHeader();
  const { title, subtitle } = state;

  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      {subtitle ? <p className="text-muted-foreground text-sm">{subtitle}</p> : null}
    </div>
  );
}
