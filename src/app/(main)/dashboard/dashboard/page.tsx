"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { usePageHeaderConfig } from "@/app/(main)/dashboard/_components/page-header";
import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);

  const headerActions = useMemo(
    () => (
      <Button className="h-10 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" onClick={() => setOpenDialog(true)}>
        Create Tournament
      </Button>
    ),
    [setOpenDialog],
  );

  const headerConfig = useMemo(
    () => ({
      title: "Dashboard",
      subtitle: "Quick overview of your Daily Dog Fights operations.",
      actions: headerActions,
    }),
    [headerActions],
  );

  usePageHeaderConfig(headerConfig);

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="relative h-64 w-64">
            <Image src="/img1.png" alt="Create tournament illustration" fill className="object-contain" priority />
          </div>
          <Button className="bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" onClick={() => setOpenDialog(true)}>
            Create Your First Tournament
          </Button>
        </div>
      </div>
      <CreateTournamentDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
