"use client";

import { useState } from "react";

import Image from "next/image";

import { CreateTournamentDialog } from "@/components/tournaments/create-tournament-dialog";
import { Button } from "@/components/ui/button";

const EMPTY_STATE_IMAGE = "/images/tournaments/empty-state.png";

export default function Page() {
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <>
      <div className="flex h-full items-center justify-center">
        <div className="flex max-w-md flex-col items-center gap-6 text-center">
          <div className="relative h-64 w-64">
            <Image
              src={EMPTY_STATE_IMAGE}
              alt="Illustration for empty tournaments"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold">Create Your First Tournament</h1>
            <p className="text-muted-foreground text-sm">
              Launch a new bracket, schedule matches, and keep every dog fight running on time.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]"
            onClick={() => setOpenDialog(true)}
          >
            Create Tournament
          </Button>
        </div>
      </div>
      <CreateTournamentDialog open={openDialog} onOpenChange={setOpenDialog} />
    </>
  );
}
