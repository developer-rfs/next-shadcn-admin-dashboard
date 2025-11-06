"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { register as registerUser } from "@/services/auth";
import { Eye, EyeOff } from "lucide-react";

const PHONE_REGEX = /^\+?[0-9]{6,15}$/;

const FormSchema = z
  .object({
    full_name: z.string().min(2, { message: "Please enter your full name." }),
    organization: z.string().min(2, { message: "Please enter your organization name." }),
    contact_number: z
      .string()
      .min(6, { message: "Enter a valid contact number." })
      .max(16, { message: "Contact number must be at most 15 digits." })
      .regex(PHONE_REGEX, { message: "Enter a valid contact number." }),
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

const sanitizeContactNumber = (value: string) => {
  const trimmed = value.replace(/[^\d+]/g, "");
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\+/g, "");
  const limitedDigits = digits.slice(0, 15);
  return (hasPlus ? "+" : "") + limitedDigits;
};

const inputStyles =
  "h-12 rounded-none border-slate-900/50 shadow-none focus-visible:border-slate-900 focus-visible:ring-0";

export function RegisterForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      full_name: "",
      organization: "",
      contact_number: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        full_name: data.full_name,
        organization: data.organization,
        contact_number: data.contact_number,
        email: data.email,
        password: data.password,
      });

      toast.success("Account created", {
        description: "We've sent a verification code to your email.",
      });
      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error) {
      if (error instanceof ApiError) {
        const details = error.details as Record<string, string[]> | undefined;
        if (details) {
          Object.entries(details).forEach(([key, messages]) => {
            if (key in form.getValues()) {
              form.setError(key as keyof z.infer<typeof FormSchema>, {
                type: "server",
                message: Array.isArray(messages) ? messages.join(" ") : String(messages),
              });
            }
          });
        }
        toast.error("Registration failed", { description: error.message });
      } else {
        toast.error("Registration failed", { description: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  id="full_name"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className={inputStyles}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile</FormLabel>
              <FormControl>
                <Input
                  id="contact_number"
                  type="tel"
                  placeholder="Enter your mobile"
                  autoComplete="tel"
                  maxLength={16}
                  className={inputStyles}
                  value={field.value}
                  onChange={(event) => field.onChange(sanitizeContactNumber(event.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  className={inputStyles}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organization</FormLabel>
              <FormControl>
                <Input
                  id="organization"
                  placeholder="Enter name"
                  autoComplete="organization"
                  className={inputStyles}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={inputStyles}
                    {...field}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-slate-900 absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className={inputStyles}
                    {...field}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-slate-900 absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full bg-[#D9D9D9] text-slate-900 hover:bg-[#c5c5c5] focus-visible:ring-0 disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          Next
        </Button>
      </form>
    </Form>
  );
}
