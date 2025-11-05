"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ApiError } from "@/lib/api-client";
import { resendOtp, verifyOtp } from "@/services/auth";

const FormSchema = z.object({
  code: z.string().min(4, "Enter the 4 digit code").max(6, "Code should be 6 digits or less"),
});

interface VerifyOtpFormProps {
  email: string;
}

export function VerifyOtpForm({ email }: VerifyOtpFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  });

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      await verifyOtp({ email: normalizedEmail, code: data.code });
      toast.success("Verification successful", {
        description: "You can now sign in to your account.",
      });
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Verification failed", { description: error.message });
      } else {
        toast.error("Verification failed", { description: "Something went wrong. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await resendOtp({ email: normalizedEmail });
      toast.success("OTP resent", {
        description: "Please check your inbox for a new verification code.",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error("Unable to resend OTP", { description: error.message });
      } else {
        toast.error("Unable to resend OTP", { description: "Something went wrong. Please try again." });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter the OTP"
                    autoComplete="one-time-code"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-70"
            disabled={isSubmitting}
          >
            Verify Account
          </Button>
        </form>
      </Form>
      <Button
        type="button"
        variant="outline"
        className="w-full border border-slate-300 text-slate-900 hover:bg-[#d4d4d4] disabled:opacity-70"
        onClick={handleResendOtp}
        disabled={isResending}
      >
        Resend Code
      </Button>
    </div>
  );
}
