"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

type SignUpFormValues = z.infer<typeof formSchema>;

export const SignUpForm = () => {
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: SignUpFormValues) {
    console.log(values);
  }

  return (
    <div className="rounded-[28px] border border-white/[0.1] bg-white/[0.025] p-6 sm:p-7">
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-white/35">
          New here?
        </p>

        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-white">
          Create account
        </h2>

        <p className="text-sm leading-6 text-white/50">
          Create your account and start exploring Orakl.
        </p>
      </div>

      <form
        id="sign-up-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-8"
      >
        <FieldGroup>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="signup-name"
                  className="text-sm text-white/60"
                >
                  Name
                </FieldLabel>

                <Input
                  {...field}
                  id="signup-name"
                  type="text"
                  aria-invalid={fieldState.invalid}
                  autoComplete="name"
                  placeholder="Your name"
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
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor="signup-email"
                  className="text-sm text-white/60"
                >
                  Email
                </FieldLabel>

                <Input
                  {...field}
                  id="signup-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  autoComplete="email"
                  placeholder="you@example.com"
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
                  htmlFor="signup-password"
                  className="text-sm text-white/60"
                >
                  Password
                </FieldLabel>

                <Input
                  {...field}
                  id="signup-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
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
        </FieldGroup>

        <Button
          type="submit"
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
          "
        >
          Create account
        </Button>
      </form>
    </div>
  );
};
