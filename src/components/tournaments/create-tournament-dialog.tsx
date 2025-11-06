"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { CreateTournamentForm } from "@/components/tournaments/create-tournament-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Tournament name is required."),
  description: z.string().min(1, "Description is required."),
  organizerEmail: z.string().email("Enter a valid email."),
  organizerPhone: z.string().min(1, "Organizer phone is required."),
  tournamentPhoto: z
    .custom<File | null | undefined>((value) => {
      if (value === null || value === undefined) return true;
      if (typeof File === "undefined") return true;
      return value instanceof File;
    }, "Upload a valid image file.")
    .optional(),
  startDate: z.string().min(1, "Select a start date."),
  checkInTime: z.string().min(1, "Select a check-in time."),
  venue: z.string().min(1, "Venue is required."),
  venueSlopeRating: z.number().nullable(),
  venueHoles: z.number().nullable(),
  teeSets: z.array(z.string()).nonempty("Select at least one tee set."),
  teamSize: z.number().min(1, "Team size must be at least 1."),
});

export type CreateTournamentFormValues = z.infer<typeof formSchema>;

interface CreateTournamentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate?: (values: CreateTournamentFormValues) => void;
}

const TEE_OPTIONS = ["Gold", "Blue", "White", "Red"] as const;

export function CreateTournamentDialog({ open, onOpenChange, onCreate }: CreateTournamentDialogProps) {
  const form = useForm<CreateTournamentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      organizerEmail: "",
      organizerPhone: "",
      tournamentPhoto: null,
      startDate: "",
      checkInTime: "",
      venue: "",
      venueSlopeRating: null,
      venueHoles: null,
      teeSets: [TEE_OPTIONS[0]],
      teamSize: 4,
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    onCreate?.(values);
    toast.success("Tournament created", {
      description: "Copy the invite link and share it with your players.",
    });
    onOpenChange(false);
    form.reset();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[calc(100vh-3rem)] overflow-y-auto p-0">
        <DialogHeader className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4 text-left">
          <DialogTitle>Create Tournament</DialogTitle>
          <DialogDescription>Provide the essentials so teams can join and compete.</DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-6 pt-4">
          <CreateTournamentForm form={form} teeOptions={TEE_OPTIONS} onSubmit={handleSubmit} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
