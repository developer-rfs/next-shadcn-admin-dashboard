"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const steps = ["Tournament Details", "Location", "Schedule"];

type FormData = {
  name: string;
  details: string;
  location: string;
  startDate: string;
  endDate: string;
};

export default function Page() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    details: "",
    location: "",
    startDate: "",
    endDate: "",
  });

  const goToPrevious = () => setStep((current) => Math.max(current - 1, 0));
  const goToNext = () => setStep((current) => Math.min(current + 1, steps.length - 1));

  const handleChange = (field: keyof FormData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setIsPublished(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPublished(true);
    toast.success("Tournament published (demo)", {
      description: "Form data is ready to send to your backend integration.",
    });
  };

  const handleFinish = () => {
    router.push("/dashboard/tournaments");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost">
          <Link href="/dashboard/tournaments">Back to tournaments</Link>
        </Button>
        <span className="text-muted-foreground text-sm">
          Step {step + 1} of {steps.length}: {steps[step]}
        </span>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Create a new tournament</CardTitle>
            <CardDescription>Complete the steps below to publish your tournament.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              {steps.map((label, index) => (
                <div key={label} className="flex items-center gap-2">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      index === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className={index === step ? "text-foreground font-medium" : undefined}>{label}</span>
                  {index < steps.length - 1 && <span className="text-muted-foreground">/</span>}
                </div>
              ))}
            </div>

            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Tournament name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Summer Open 2025"
                    value={formData.name}
                    onChange={handleChange("name")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="details">Tournament details</Label>
                  <Textarea
                    id="details"
                    placeholder="Describe format, prize pool, participating teams..."
                    value={formData.details}
                    onChange={handleChange("details")}
                    rows={5}
                    required
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="City, Country or Online"
                    value={formData.location}
                    onChange={handleChange("location")}
                    required
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange("startDate")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange("endDate")}
                    required
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={goToPrevious} disabled={step === 0}>
                Previous
              </Button>
              {step < steps.length - 1 && (
                <Button type="button" onClick={goToNext}>
                  Next
                </Button>
              )}
            </div>
            {step === steps.length - 1 && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button type="submit">Publish</Button>
                <Button type="button" variant="secondary" onClick={handleFinish} disabled={!isPublished}>
                  Finish
                </Button>
              </div>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
