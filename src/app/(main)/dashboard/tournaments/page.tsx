"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import { Copy, PencilLine, Users2, UserRound } from "lucide-react";
import { toast } from "sonner";

import { usePageHeaderConfig } from "@/app/(main)/dashboard/_components/page-header";
import {
  CreateTournamentDialog,
  type CreateTournamentFormValues,
} from "@/components/tournaments/create-tournament-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TournamentRow = {
  id: string;
  startDate: string;
  teamCount: number;
  playerCount: number;
};

const highlightTournament = {
  name: "Florida Golf Club",
  image: "/img1.png",
  date: "25 Nov, 2025",
  time: "10:00 AM",
  difficulty: "30",
  shareLink: "https://example.com/tournaments/florida-golf-club",
};

const initialActiveRows: TournamentRow[] = [
  { id: "1", startDate: "2025-11-25", teamCount: 24, playerCount: 96 },
  { id: "2", startDate: "2025-11-25", teamCount: 36, playerCount: 120 },
  { id: "3", startDate: "2025-11-25", teamCount: 18, playerCount: 72 },
  { id: "4", startDate: "2025-11-25", teamCount: 20, playerCount: 80 },
  { id: "5", startDate: "2025-11-25", teamCount: 28, playerCount: 72 },
  { id: "6", startDate: "2025-11-25", teamCount: 32, playerCount: 48 },
  { id: "7", startDate: "2025-11-25", teamCount: 36, playerCount: 96 },
];

const initialPastRows: TournamentRow[] = [
  { id: "p1", startDate: "2025-10-18", teamCount: 20, playerCount: 60 },
  { id: "p2", startDate: "2025-09-01", teamCount: 22, playerCount: 70 },
  { id: "p3", startDate: "2025-08-15", teamCount: 18, playerCount: 58 },
];

const statCards = [
  { id: "teams", label: "Total Teams", value: "32", icon: Users2 },
  { id: "players", label: "Total Players", value: "100 / 32", icon: UserRound },
];

const formatDisplayDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeRows, setActiveRows] = useState(initialActiveRows);
  const [pastRows] = useState(initialPastRows);
  const [filter, setFilter] = useState<"active" | "past">("active");

  const headerActions = useMemo(
    () => (
      <Button className="h-11 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" onClick={() => setDialogOpen(true)}>
        Create New Tournament
      </Button>
    ),
    [setDialogOpen],
  );

  const headerConfig = useMemo(
    () => ({
      title: "Tournament",
      subtitle: "Review upcoming events and manage registrations.",
      actions: headerActions,
    }),
    [headerActions],
  );

  usePageHeaderConfig(headerConfig);

  const tableRows = useMemo(() => (filter === "active" ? activeRows : pastRows), [activeRows, pastRows, filter]);

  const handleCreate = (values: CreateTournamentFormValues) => {
    const newRow: TournamentRow = {
      id: crypto.randomUUID(),
      startDate: values.startDate,
      teamCount: values.teamSize,
      playerCount: values.teamSize * 4,
    };
    setActiveRows((prev) => [newRow, ...prev]);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(highlightTournament.shareLink);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to copy link right now");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4 lg:flex-row">
          <Card className="flex-1 border border-slate-300 bg-white shadow-sm">
            <CardContent className="grid gap-6 p-5 lg:grid-cols-[260px_1fr] lg:items-center">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-slate-200">
                <Image src={highlightTournament.image} alt={highlightTournament.name} fill className="object-cover" />
              </div>
              <div className="flex h-full flex-col gap-6">
                <div>
                  <h2 className="text-2xl font-semibold">{highlightTournament.name}</h2>
                  <p className="text-muted-foreground text-sm">Upcoming featured tournament</p>
                </div>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <dt className="text-muted-foreground">Date</dt>
                    <dd className="font-medium">{highlightTournament.date}</dd>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <dt className="text-muted-foreground">Time</dt>
                    <dd className="font-medium">{highlightTournament.time}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Difficulty</dt>
                    <dd className="font-medium">{highlightTournament.difficulty}</dd>
                  </div>
                </dl>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    className="gap-2 border border-slate-300 text-slate-900 hover:bg-[#d4d4d4]"
                    onClick={handleCopyLink}
                  >
                    <Copy className="size-4" />
                    Copy Link
                  </Button>
                  <Button variant="outline" className="gap-2 border border-slate-300 text-slate-900" disabled>
                    <PencilLine className="size-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex w-full flex-col gap-4 lg:w-80">
            {statCards.map((card) => (
              <Card key={card.id} className="border border-slate-300 bg-[#e5e5e5]">
                <CardContent className="flex items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-muted-foreground text-xs tracking-wide uppercase">{card.label}</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-900">{card.value}</p>
                  </div>
                  <card.icon className="size-8 text-slate-700" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">Tournaments</h2>
            <div className="flex gap-3">
              <Button
                variant={filter === "active" ? "default" : "outline"}
                className={`rounded-full px-6 ${filter === "active" ? "bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" : "border-slate-300 text-slate-900"}`}
                onClick={() => setFilter("active")}
              >
                Active Tournaments
              </Button>
              <Button
                variant={filter === "past" ? "default" : "outline"}
                className={`rounded-full px-6 ${filter === "past" ? "bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" : "border-slate-300 text-slate-900"}`}
                onClick={() => setFilter("past")}
              >
                Past Tournaments
              </Button>
            </div>
          </div>

          <Card className="border border-slate-300">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Start Date</TableHead>
                    <TableHead>No of Total Team</TableHead>
                    <TableHead>No of Total Player</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{formatDisplayDate(row.startDate)}</TableCell>
                      <TableCell>{row.teamCount}</TableCell>
                      <TableCell>{row.playerCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </section>
      </div>
      <CreateTournamentDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreate} />
    </>
  );
}
