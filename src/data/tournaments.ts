export type Tournament = {
  id: string;
  name: string;
  details: string;
  location: string;
  startDate: string;
  endDate: string;
  status: "Scheduled" | "In Progress" | "Completed";
};

export const tournaments: Tournament[] = [
  {
    id: "1",
    name: "Summer Open 2025",
    details: "Regional qualifiers for the summer split.",
    location: "Los Angeles, USA",
    startDate: "2025-07-12",
    endDate: "2025-07-15",
    status: "Scheduled",
  },
  {
    id: "2",
    name: "Winter Championship",
    details: "Top 16 teams compete for the grand title.",
    location: "Berlin, Germany",
    startDate: "2025-12-03",
    endDate: "2025-12-07",
    status: "In Progress",
  },
  {
    id: "3",
    name: "Spring Invitational",
    details: "Invite-only event with international teams.",
    location: "Tokyo, Japan",
    startDate: "2025-04-20",
    endDate: "2025-04-24",
    status: "Completed",
  },
];
