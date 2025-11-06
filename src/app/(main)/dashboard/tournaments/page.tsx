"use client";

import { useMemo, useState } from "react";

import Image from "next/image";

import {
  CalendarDays,
  Clock,
  DollarSign,
  Filter,
  HeartHandshake,
  MapPin,
  Trophy,
  Users,
  Users2,
} from "lucide-react";

import { usePageHeaderConfig } from "@/app/(main)/dashboard/_components/page-header";
import {
  CreateTournamentDialog,
  type CreateTournamentFormValues,
} from "@/components/tournaments/create-tournament-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TournamentStatus = "upcoming" | "active" | "completed";

type TournamentCardData = {
  id: string;
  name: string;
  status: TournamentStatus;
  startDate: string;
  time: string;
  playersPerTeam: number;
  registrationCost: string;
  venue: string;
  charity: string;
  image: string;
  totalPlayers: number;
  totalDonations: number;
};

const TOURNAMENT_IMAGE = "/img1.png";

const initialTournaments: TournamentCardData[] = [
  {
    id: "1",
    name: "Florida Golf Club",
    status: "upcoming",
    startDate: "2025-11-25T10:00:00-05:00",
    time: "10:00 AM (EST)",
    playersPerTeam: 4,
    registrationCost: "$30",
    venue: "Sugar Land, Texas",
    charity: "Fort Ben Foundation",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 120,
    totalDonations: 12350,
  },
  {
    id: "2",
    name: "Desert Classic",
    status: "upcoming",
    startDate: "2025-12-05T09:30:00-07:00",
    time: "9:30 AM (MST)",
    playersPerTeam: 4,
    registrationCost: "$45",
    venue: "Scottsdale, Arizona",
    charity: "Play It Forward",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 96,
    totalDonations: 9800,
  },
  {
    id: "3",
    name: "Coastal Invitational",
    status: "active",
    startDate: "2025-11-02T08:45:00-05:00",
    time: "8:45 AM (EST)",
    playersPerTeam: 3,
    registrationCost: "$25",
    venue: "Hilton Head, South Carolina",
    charity: "Coastal Care Fund",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 72,
    totalDonations: 7650,
  },
  {
    id: "4",
    name: "Cedar Pines Cup",
    status: "active",
    startDate: "2025-11-10T11:00:00-06:00",
    time: "11:00 AM (CST)",
    playersPerTeam: 4,
    registrationCost: "$35",
    venue: "Austin, Texas",
    charity: "Lone Star Juniors",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 84,
    totalDonations: 8450,
  },
  {
    id: "5",
    name: "Autumn Masters",
    status: "completed",
    startDate: "2025-10-12T10:15:00-04:00",
    time: "10:15 AM (EST)",
    playersPerTeam: 4,
    registrationCost: "$30",
    venue: "Charlotte, North Carolina",
    charity: "Greenway Trust",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 88,
    totalDonations: 10400,
  },
  {
    id: "6",
    name: "Champions Charity Open",
    status: "completed",
    startDate: "2025-09-18T09:00:00-05:00",
    time: "9:00 AM (CST)",
    playersPerTeam: 2,
    registrationCost: "$50",
    venue: "Chicago, Illinois",
    charity: "First Tee Chicago",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 64,
    totalDonations: 15200,
  },
  {
    id: "7",
    name: "Harbor Links Showdown",
    status: "upcoming",
    startDate: "2026-01-15T08:30:00-05:00",
    time: "8:30 AM (EST)",
    playersPerTeam: 4,
    registrationCost: "$40",
    venue: "Boston, Massachusetts",
    charity: "Harbor Youth Golf",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 112,
    totalDonations: 11800,
  },
  {
    id: "8",
    name: "Palm Grove Classic",
    status: "active",
    startDate: "2025-11-28T13:00:00-05:00",
    time: "1:00 PM (EST)",
    playersPerTeam: 2,
    registrationCost: "$35",
    venue: "Miami, Florida",
    charity: "Sunshine Golf Initiative",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 54,
    totalDonations: 6400,
  },
  {
    id: "9",
    name: "Highland Open",
    status: "completed",
    startDate: "2025-08-02T09:45:00-04:00",
    time: "9:45 AM (EST)",
    playersPerTeam: 3,
    registrationCost: "$28",
    venue: "Asheville, North Carolina",
    charity: "Mountain Trails Fund",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 63,
    totalDonations: 7200,
  },
  {
    id: "10",
    name: "Lakeside Charity Invitational",
    status: "upcoming",
    startDate: "2026-02-20T10:15:00-06:00",
    time: "10:15 AM (CST)",
    playersPerTeam: 4,
    registrationCost: "$38",
    venue: "Brainerd, Minnesota",
    charity: "North Shore Juniors",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 128,
    totalDonations: 13450,
  },
  {
    id: "11",
    name: "River Bend Cup",
    status: "active",
    startDate: "2025-11-22T07:45:00-05:00",
    time: "7:45 AM (EST)",
    playersPerTeam: 4,
    registrationCost: "$32",
    venue: "Richmond, Virginia",
    charity: "River Bend Youth Golf",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 76,
    totalDonations: 8900,
  },
  {
    id: "12",
    name: "Summit Peaks Pro-Am",
    status: "completed",
    startDate: "2025-07-11T12:10:00-06:00",
    time: "12:10 PM (CST)",
    playersPerTeam: 4,
    registrationCost: "$55",
    venue: "Denver, Colorado",
    charity: "Altitude Sports Fund",
    image: TOURNAMENT_IMAGE,
    totalPlayers: 92,
    totalDonations: 16250,
  },
];

const formatDate = (isoDate: string) =>
  new Date(isoDate).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const FILTER_OPTIONS: { label: string; value: TournamentStatus }[] = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

export default function Page() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tournaments, setTournaments] = useState(initialTournaments);
  const [filter, setFilter] = useState<TournamentStatus>("upcoming");

  const headerActions = useMemo(
    () => (
      <Button className="h-11 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]" onClick={() => setDialogOpen(true)}>
        Create Tournament
      </Button>
    ),
    [setDialogOpen],
  );

  usePageHeaderConfig(
    useMemo(
      () => ({
        title: "Tournament Dashboard",
        subtitle: "Track all upcoming, active, and completed events in one place.",
        actions: headerActions,
      }),
      [headerActions],
    ),
  );

  const filteredTournaments = useMemo(
    () => tournaments.filter((tournament) => tournament.status === filter),
    [tournaments, filter],
  );

  const summaryMetrics = useMemo(() => {
    const totalTournaments = tournaments.length;
    const totalPlayers = tournaments.reduce((sum, tournament) => sum + tournament.totalPlayers, 0);
    const totalDonations = tournaments.reduce((sum, tournament) => sum + tournament.totalDonations, 0);

    return [
      { id: "tournaments", label: "Total Tournaments", value: totalTournaments.toString(), icon: Trophy },
      { id: "players", label: "Total Players", value: totalPlayers.toLocaleString(), icon: Users2 },
      {
        id: "donations",
        label: "Total Donations",
        value: `$${totalDonations.toLocaleString()}`,
        icon: DollarSign,
      },
    ];
  }, [tournaments]);

  const handleCreate = (values: CreateTournamentFormValues) => {
    const createdTournament: TournamentCardData = {
      id: crypto.randomUUID(),
      name: values.name,
      status: "upcoming",
      startDate: values.startDate,
      time: `${values.checkInTime} (EST)`,
      playersPerTeam: values.teamSize,
      registrationCost: "$30",
      venue: values.venue,
      charity: "Fort Ben Foundation",
      image: TOURNAMENT_IMAGE,
      totalPlayers: values.teamSize * 4,
      totalDonations: 5000,
    };

    setTournaments((prev) => [createdTournament, ...prev]);
    setFilter("upcoming");
  };

  return (
    <>
      <div className="flex flex-col gap-8">
        <section className="grid gap-4 md:grid-cols-3">
          {summaryMetrics.map((metric) => (
            <Card key={metric.id} className="border border-slate-200">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide">{metric.label}</p>
                  <p className="text-3xl font-semibold text-slate-900">{metric.value}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-full bg-[#dedede]">
                  <metric.icon className="size-6 text-slate-900" />
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Tournaments</h2>
              <p className="text-muted-foreground text-sm">
                Browse all events and drill into the details when you are ready.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="h-10 gap-2 border border-slate-300 bg-white text-slate-900 hover:bg-[#d4d4d4]"
              >
                <Filter className="size-4" />
                Filter
              </Button>
              <div className="flex gap-2">
                {FILTER_OPTIONS.map((option) => {
                  const isActive = filter === option.value;
                  return (
                    <Button
                      key={option.value}
                      variant="outline"
                      className={`h-10 rounded-full px-6 text-sm ${
                        isActive
                          ? "border-slate-900 bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]"
                          : "border-slate-300 text-slate-900 hover:bg-[#ededed]"
                      }`}
                      onClick={() => setFilter(option.value)}
                    >
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredTournaments.map((tournament) => (
              <Card key={tournament.id} className="border border-slate-200">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <Image src={tournament.image} alt={tournament.name} fill className="object-cover" />
                </div>
                <CardContent className="space-y-6 p-6">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{tournament.name}</h3>
                  </div>
                  <dl className="grid grid-cols-1 gap-3 text-sm text-slate-900 md:grid-cols-2">
                    {[
                      { label: "Date", value: formatDate(tournament.startDate), icon: CalendarDays },
                      { label: "Time", value: tournament.time, icon: Clock },
                      { label: "Players per team", value: tournament.playersPerTeam, icon: Users },
                      { label: "Registration Cost", value: tournament.registrationCost, icon: DollarSign },
                      { label: "Venue", value: tournament.venue, icon: MapPin },
                      { label: "Benefiting Charity", value: tournament.charity, icon: HeartHandshake },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-[#ededed]">
                          <item.icon className="size-4 text-slate-900" />
                        </div>
                        <div className="space-y-1">
                          <dt className="text-muted-foreground text-xs uppercase">{item.label}</dt>
                          <dd className="text-sm font-medium leading-none text-slate-900">{item.value}</dd>
                        </div>
                      </div>
                    ))}
                  </dl>
                  <Button className="w-full bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]">View Details</Button>
                </CardContent>
              </Card>
            ))}

            {filteredTournaments.length === 0 && (
              <Card className="border border-dashed border-slate-300 bg-white">
                <CardContent className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
                  <p className="text-lg font-semibold text-slate-900">No tournaments yet</p>
                  <p className="text-muted-foreground text-sm">
                    Switch filters or create a tournament to get the ball rolling.
                  </p>
                  <Button
                    className="bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]"
                    onClick={() => setDialogOpen(true)}
                  >
                    Create Tournament
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
      <CreateTournamentDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={handleCreate} />
    </>
  );
}
