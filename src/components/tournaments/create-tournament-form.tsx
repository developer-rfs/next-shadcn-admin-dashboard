import { useEffect, useMemo, useState } from "react";

import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CourseResult } from "@/lib/golf-course-search";

import type { CreateTournamentFormValues } from "./create-tournament-dialog";
import { VenueSearchField } from "./venue-search-field";

export interface CreateTournamentFormProps {
  form: UseFormReturn<CreateTournamentFormValues>;
  teeOptions: readonly string[];
  onSubmit: () => void;
}

export function CreateTournamentForm({ form, teeOptions, onSubmit }: CreateTournamentFormProps) {
  const defaultTeeSets = useMemo(
    () => Array.from(new Set(teeOptions.map((option) => option.trim()).filter(Boolean))),
    [teeOptions],
  );
  const [availableTeeSets, setAvailableTeeSets] = useState<string[]>(defaultTeeSets);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const photoValue = form.watch("tournamentPhoto") as File | null | undefined;

  useEffect(() => {
    if (!photoValue) {
      setPhotoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photoValue);
    setPhotoPreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photoValue]);

  const updateTeeSetOptions = (candidates: string[]) => {
    const normalized = Array.from(new Set(candidates.map((value) => value.trim()).filter(Boolean)));
    const nextOptions = normalized.length > 0 ? normalized : defaultTeeSets;

    setAvailableTeeSets(nextOptions);

    if (nextOptions.length === 0) {
      form.setValue("teeSets", [], { shouldDirty: true, shouldValidate: true });
      return;
    }

    const currentSelectionRaw = form.getValues("teeSets");
    const currentSelection = Array.isArray(currentSelectionRaw) ? currentSelectionRaw : [];
    const filteredSelection = currentSelection.filter((value) => nextOptions.includes(value));
    const nextSelection = filteredSelection.length > 0 ? filteredSelection : [nextOptions[0]];

    form.setValue("teeSets", nextSelection, { shouldDirty: true, shouldValidate: true });
  };

  const handleCourseChange = (course: CourseResult | null) => {
    if (course && course.teeSets.length > 0) {
      updateTeeSetOptions(course.teeSets);
      return;
    }
    updateTeeSetOptions([]);
  };

  const teeSetOptions = availableTeeSets.length > 0 ? availableTeeSets : defaultTeeSets;

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="tournamentPhoto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tournament Photo</FormLabel>
              <FormControl>
                <label className="flex h-40 cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-400 bg-white text-center transition-colors hover:bg-slate-100">
                  <input
                    ref={field.ref}
                    name={field.name}
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onBlur={field.onBlur}
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      field.onChange(file);
                      event.target.value = "";
                    }}
                  />
                  {photoPreview ? (
                    <div className="relative h-full w-full overflow-hidden rounded-md">
                      <img src={photoPreview} alt="Tournament photo preview" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">Upload Tournament Photo</span>
                  )}
                </label>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <VenueSearchField form={form} onCourseChange={handleCourseChange} />

        <FormField
          control={form.control}
          name="teeSets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tee Sets</FormLabel>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                {teeSetOptions.map((option) => {
                  const currentValue = Array.isArray(field.value) ? field.value : [];
                  const isSelected = currentValue.includes(option);
                  return (
                    <Label
                      key={option}
                      className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm select-none"
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...currentValue, option]);
                          } else {
                            field.onChange(currentValue.filter((value) => value !== option));
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
              <p className="text-muted-foreground text-xs">Max 12 team members</p>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-[#d4d4d4] text-slate-900 hover:bg-[#c4c4c4]">
          Create Tournament
        </Button>
      </form>
    </Form>
  );
}
