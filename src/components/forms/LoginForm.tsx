"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: LoginFormValues) {
    form.clearErrors("root");

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        form.setError("root", {
          message: error.message ?? "Unable to sign in. Please try again.",
        });

        return;
      }

      router.push("/account");
      router.refresh();
    } catch {
      form.setError("root", {
        message: "Unable to connect to Orakl. Please try again.",
      });
    }
  }

  return (
    <div className="rounded-[28px] border border-white/[0.1] bg-white/[0.025] p-6 sm:p-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
          Welcome back
        </p>

        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
          Sign in
        </h2>

        <p className="text-sm leading-6 text-white/50">
          Enter your details to continue to Orakl.
        </p>
      </div>

      <form
        id="login-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8"
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="login-email"
                  className="text-sm text-white/60"
                >
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id="login-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  className="
                    h-12
                    rounded-2xl
                    border-white/[0.12]
                    bg-white/[0.04]
                    text-white
                    placeholder:text-white/25
                    focus-visible:border-white/25
                    focus-visible:ring-white/10
                  "
                />

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-[#F05A28]"
                  />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="login-password"
                  className="text-sm text-white/60"
                >
                  Password
                </FieldLabel>

                <div className="relative">
                  <Input
                    {...field}
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    className="
      h-12
      rounded-2xl
      border-white/[0.12]
      bg-white/[0.04]
      pr-12
      text-white
      placeholder:text-white/25
      focus-visible:border-white/25
      focus-visible:ring-white/10
    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                    className="
      absolute
      right-4
      top-1/2
      -translate-y-1/2
      text-white/35
      transition-colors
      hover:text-white/70
      focus-visible:outline-none
      focus-visible:text-white
      disabled:pointer-events-none
      disabled:opacity-50
    "
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <Eye className="size-4" aria-hidden="true" />
                    ) : (
                      <EyeOff className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>

                {fieldState.invalid && (
                  <FieldError
                    errors={[fieldState.error]}
                    className="text-[#F05A28]"
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        {form.formState.errors.root?.message && (
          <p role="alert" className="mt-5 text-sm leading-6 text-[#F05A28]">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="
            mt-8
            min-h-11
            w-full
            rounded-full
            border
            border-white/[0.16]
            bg-white/[0.08]
            text-sm
            font-medium
            text-white
            transition-colors
            hover:bg-white/[0.14]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </div>
  );
};
