export type Team = {
  id: string;
  name: string;
  organizerPhone: string;
  organizerEmail: string;
};

export const teams: Team[] = [
  {
    id: "team-1",
    name: "New York Eagles",
    organizerPhone: "+1 234 567 890",
    organizerEmail: "johns@golflink.com",
  },
  {
    id: "team-2",
    name: "Texas Stallions",
    organizerPhone: "+1 234 567 890",
    organizerEmail: "johns@golflink.com",
  },
  {
    id: "team-3",
    name: "California Bears",
    organizerPhone: "+1 234 567 890",
    organizerEmail: "johns@golflink.com",
  },
  {
    id: "team-4",
    name: "Florida Falcons",
    organizerPhone: "+1 234 567 330",
    organizerEmail: "mia@golflink.com",
  },
  {
    id: "team-5",
    name: "Chicago Chargers",
    organizerPhone: "+1 234 900 123",
    organizerEmail: "coachc@golflink.com",
  },
];
