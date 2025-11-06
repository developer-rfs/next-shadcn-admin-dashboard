"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { login } from "@/services/auth";

const FormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  remember: z.boolean().optional(),
});

const inputStyles =
  "h-12 rounded-none border-slate-900/50 shadow-none focus-visible:border-slate-900 focus-visible:ring-0";

export function LoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await login({ email: data.email, password: data.password });
      const token = response.data?.token ?? null;

      if (!token) {
        toast.info("Please verify your account first.", {
          description: "We sent you a verification code when you registered.",
        });
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      window.localStorage.setItem("ddf.auth.token", token);
      toast.success("Welcome back!", {
        description: `Signed in as ${data.email}. Redirecting to the dashboard...`,
      });
      router.push("/dashboard/tournaments");
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
        toast.error("Login failed", { description: error.message });
      } else {
        toast.error("Login failed", { description: "Something went wrong. Please try again." });
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email or username"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={inputStyles}
                    {...field}
                  />
                  <button
                    type="button"
                    className="text-muted-foreground absolute inset-y-0 right-0 flex items-center pr-3 hover:text-slate-900"
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
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-medium text-slate-900 hover:underline">
            Forgot Password?
          </Link>
        </div>
        <Button
          className="w-full bg-[#D9D9D9] text-slate-900 hover:bg-[#c5c5c5] focus-visible:ring-0 disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
