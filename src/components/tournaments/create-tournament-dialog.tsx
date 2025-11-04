"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(1, "Tournament name is required."),
  description: z.string().min(1, "Description is required."),
  organizerEmail: z.string().email("Enter a valid email."),
  organizerPhone: z.string().min(1, "Organizer phone is required."),
  startDate: z.string().min(1, "Select a start date."),
  checkInTime: z.string().min(1, "Select a check-in time."),
  venue: z.string().min(1, "Venue is required."),
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
      startDate: "",
      checkInTime: "",
      venue: "",
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
      <DialogContent className="max-w-xl">
        <DialogHeader className="mb-4">
          <DialogTitle>Create Tournament</DialogTitle>
          <DialogDescription>Provide the essentials so teams can join and compete.</DialogDescription>
        </DialogHeader>
        <CreateTournamentForm form={form} teeOptions={TEE_OPTIONS} onSubmit={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}

interface CreateTournamentFormProps {
  form: ReturnType<typeof useForm<CreateTournamentFormValues>>;
  teeOptions: string[];
  onSubmit: () => void;
}

function CreateTournamentForm({ form, teeOptions, onSubmit }: CreateTournamentFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your tournament name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Add description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="organizerEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Email</FormLabel>
                <FormControl>
                  <Input placeholder="Organizer Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizerPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organizer Number</FormLabel>
                <FormControl>
                  <Input placeholder="Organizer Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" placeholder="Choose date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkInTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check in Time</FormLabel>
                <FormControl>
                  <Input type="time" placeholder="Choose time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="venue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue</FormLabel>
              <FormControl>
                <Input placeholder="Course venue" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teeSets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tee Sets</FormLabel>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {teeOptions.map((option) => {
                  const isSelected = field.value?.includes(option);
                  return (
                    <Label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm select-none"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...(field.value ?? []), option]);
                          } else {
                            field.onChange(field.value?.filter((value) => value !== option) ?? []);
                          }
                        }}
                      />
                      {option}
                    </Label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Size</FormLabel>
              <div className="flex items-center gap-4 rounded-md border px-4 py-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="border"
                  onClick={() => field.onChange(Math.max(1, Number(field.value) - 1))}
                >
                  -
                </Button>
                <span className="text-lg">{field.value}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="border"
                  onClick={() => field.onChange(Number(field.value) + 1)}
                >
                  +
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">Max 12 team member</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]">
          Create and Copy Invite Link
        </Button>
      </form>
    </Form>
  );
}
