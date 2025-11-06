import { useEffect, useState, type KeyboardEvent } from "react";

import { Loader2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CourseResult, isGolfCourseSearchConfigured, searchGolfCourses } from "@/lib/golf-course-search";

import type { CreateTournamentFormValues } from "./create-tournament-dialog";

interface VenueSearchFieldProps {
  form: UseFormReturn<CreateTournamentFormValues>;
  onCourseChange?: (course: CourseResult | null) => void;
}

export function VenueSearchField({ form, onCourseChange }: VenueSearchFieldProps) {
  const [searchResults, setSearchResults] = useState<CourseResult[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const venueValue = form.watch("venue");
  const slopeValue = form.watch("venueSlopeRating");
  const holesValue = form.watch("venueHoles");
  const searchConfigured = isGolfCourseSearchConfigured();

  useEffect(() => {
    if (!venueValue) {
      setSelectedCourseId(null);
      setSearchResults([]);
      setSearchError(null);
      form.setValue("venueSlopeRating", null);
      form.setValue("venueHoles", null);
      onCourseChange?.(null);
    }
  }, [venueValue, form, onCourseChange]);

  const runCourseSearch = async () => {
    setIsSearching(true);
    setSearchError(null);
    setSearchResults([]);
    form.clearErrors("venue");

    try {
      const courses = await searchGolfCourses(form.getValues("venue"));
      setSearchResults(courses);
      if (!courses.length) {
        setSearchError("No courses found. Try a different search.");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to search courses right now.";
      setSearchResults([]);
      if (message.toLowerCase().includes("course name")) {
        form.setError("venue", { type: "manual", message });
      } else {
        setSearchError(message);
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleCourseSelect = (course: CourseResult) => {
    setSelectedCourseId(course.id);
    form.setValue("venue", course.name, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    form.setValue("venueSlopeRating", course.slopeRating, { shouldDirty: true });
    form.setValue("venueHoles", course.holes, { shouldDirty: true });
    form.clearErrors("venue");
    setSearchResults([]);
    setSearchError(null);
    onCourseChange?.(course);
  };

  const handleVenueChange = (value: string, onChange: (value: string) => void) => {
    setSelectedCourseId(null);
    setSearchResults([]);
    setSearchError(null);
    form.setValue("venueSlopeRating", null);
    form.setValue("venueHoles", null);
    onChange(value);
  };

  const handleVenueKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }
    event.preventDefault();
    void runCourseSearch();
  };

  const searchResultsContent = !searchResults.length ? null : (
    <div className="border-input bg-background max-h-56 overflow-y-auto rounded-md border">
      {searchResults.map((course) => {
        const isActive = selectedCourseId === course.id;
        const slopeDisplay = course.slopeRating ?? "N/A";
        const holesDisplay = course.holes ?? "N/A";
        const baseClasses =
          "flex w-full flex-col items-start gap-1 px-3 py-2 text-left text-sm transition hover:bg-muted";
        const buttonClasses = isActive ? `${baseClasses} bg-muted` : baseClasses;

        return (
          <button type="button" key={course.id} onClick={() => handleCourseSelect(course)} className={buttonClasses}>
            <span className="font-medium text-slate-900">{course.name}</span>
            {course.location && <span className="text-muted-foreground text-xs">{course.location}</span>}
            <span className="text-muted-foreground text-xs">
              Slope rating: {slopeDisplay} | Holes: {holesDisplay}
            </span>
          </button>
        );
      })}
    </div>
  );

  const selectedCourseSummary = !selectedCourseId ? null : (
    <div className="text-muted-foreground rounded-md border border-dashed p-3 text-sm">
      <p className="font-semibold text-slate-900">{venueValue}</p>
      <p>Slope rating: {slopeValue ?? "N/A"}</p>
      <p>Holes: {holesValue ?? "N/A"}</p>
    </div>
  );

  const configurationMessage = searchConfigured ? null : (
    <p className="text-muted-foreground text-xs">Log in to search and select a course.</p>
  );

  const errorMessage = searchError ? <p className="text-destructive text-sm">{searchError}</p> : null;

  return (
    <FormField
      control={form.control}
      name="venue"
      render={({ field }) => {
        const fieldValue = typeof field.value === "string" ? field.value : "";
        const trimmedValue = fieldValue.trim();

        return (
          <FormItem>
            <FormLabel>Venue</FormLabel>
            <FormControl>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Search by course or city"
                    value={fieldValue}
                    onChange={(event) => handleVenueChange(event.target.value, field.onChange)}
                    onBlur={field.onBlur}
                    onKeyDown={handleVenueKeyDown}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="whitespace-nowrap"
                    onClick={() => void runCourseSearch()}
                    disabled={isSearching || trimmedValue.length === 0 || !searchConfigured}
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>
                {searchResultsContent}
                {selectedCourseSummary}
                {configurationMessage}
                {errorMessage}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
