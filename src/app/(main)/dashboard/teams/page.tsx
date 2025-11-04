"use client";

import { useMemo, useState } from "react";

import { Filter, ArrowUpDown, Search } from "lucide-react";

import { usePageHeaderConfig } from "@/app/(main)/dashboard/_components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { teams } from "@/data/teams";

export default function Page() {
  const [search, setSearch] = useState("");

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-3">
        <Button className="h-10 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]">Register a Team</Button>
        <Button className="h-10 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]">Register a Player</Button>
      </div>
    ),
    [],
  );

  const headerConfig = useMemo(
    () => ({
      title: "Teams",
      subtitle: "Manage registered teams and player invitations.",
      actions: headerActions,
    }),
    [headerActions],
  );

  usePageHeaderConfig(headerConfig);

  const filteredTeams = useMemo(
    () => teams.filter((team) => team.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">Teams</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" className="gap-2 border border-slate-300 text-slate-900">
            <Filter className="size-4" />
            Filter
          </Button>
          <Button variant="outline" className="gap-2 border border-slate-300 text-slate-900">
            <ArrowUpDown className="size-4" />
            Sort
          </Button>
          <div className="flex items-center gap-2 rounded-md border border-slate-400 px-3">
            <Search className="text-muted-foreground size-4" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search"
              className="h-9 w-40 border-none pl-0 text-sm outline-none focus-visible:ring-0"
            />
          </div>
        </div>
      </div>

      <Card className="border border-slate-300">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team Name</TableHead>
                <TableHead>Organizer Phone</TableHead>
                <TableHead>Organizer Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeams.map((team) => (
                <TableRow key={team.id}>
                  <TableCell>{team.name}</TableCell>
                  <TableCell>{team.organizerPhone}</TableCell>
                  <TableCell>{team.organizerEmail}</TableCell>
                </TableRow>
              ))}
              {filteredTeams.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground text-center text-sm">
                    No teams found.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
