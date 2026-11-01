"use client";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { login } from "./actions";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().regex(/^[A-Za-z]\d{10}$/, "NIM harus sesuai format"),
  password: z.string().min(1, "Password wajib diisi"),
});

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true);
      const response = await login(value);
      setLoading(false);
      if (response) return router.refresh();
      toast.error("NIM atau Passwordnya salah bang");
    },
  });

  return (
    <div className="flex min-h-svh flex-col lg:grid lg:grid-cols-2">
      <div className="order-2 flex flex-1 flex-col gap-4 p-6 md:p-10 lg:order-1">
        {/* Hidden on mobile/tablet, visible on desktop (lg) */}
        <div className="hidden gap-2 text-xl font-medium lg:flex lg:justify-start">
          SS23's workshop
        </div>

        {/* items-start keeps the card near the image on mobile; lg:items-center centers it on desktop */}
        <div className="flex flex-1 items-start justify-center lg:items-center">
          <div className="w-full max-w-md">
            <Card>
              <CardContent>
                <form
                  className="p-1 md:p-2"
                  id="login-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                      <h1 className="text-2xl font-bold">Selamat Datang</h1>
                      <p className="text-balance text-muted-foreground">
                        Login pake akun kamu
                      </p>
                    </div>
                    <form.Field
                      name="username"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>NIM</FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              placeholder="M0403267067"
                              autoComplete="off"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                    <form.Field
                      name="password"
                      children={(field) => {
                        const isInvalid =
                          field.state.meta.isTouched &&
                          !field.state.meta.isValid;
                        return (
                          <Field data-invalid={isInvalid}>
                            <FieldLabel htmlFor={field.name}>
                              Password
                            </FieldLabel>
                            <Input
                              id={field.name}
                              name={field.name}
                              type="password"
                              value={field.state.value}
                              onBlur={field.handleBlur}
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                              aria-invalid={isInvalid}
                              autoComplete="current-password"
                            />
                            {isInvalid && (
                              <FieldError errors={field.state.meta.errors} />
                            )}
                          </Field>
                        );
                      }}
                    />
                    <Field>
                      <Button
                        type="submit"
                        form="login-form"
                        disabled={loading}
                      >
                        {loading && <Spinner />}
                        Login
                      </Button>
                    </Field>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <div className="relative order-1 h-64 w-full shrink-0 bg-muted lg:order-2 lg:h-auto">
        <Image
          src="/assets/class-photo.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          fill
        />
      </div>
    </div>
  );
}
