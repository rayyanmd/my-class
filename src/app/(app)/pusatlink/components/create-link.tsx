"use client";
import { course } from "@/db/schema";
import { createLink } from "../actions";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(1, "Nama link wajib diisi"),
  course: z.number().int(),
  url: z.url("Link harus berupa url"),
});

export function CreateLink({
  courses,
}: {
  courses: (typeof course.$inferSelect)[];
}) {
  const courseItems = courses.map((course) => ({
    label: course.name ?? "",
    value: course.id,
  }));
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      course: -1,
      url: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      startTransition(async () => {
        try {
          await createLink(value);
          form.reset();
          setIsOpen(false);
          toast.success("Link berhasil ditambahkan");
          router.refresh();
        } catch (error) {
          setSubmitError(
            error instanceof Error
              ? error.message
              : "Link gagal disimpan. Silakan coba lagi.",
          );
        }
      });
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (open) setSubmitError(null);
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <PlusIcon /> Tambah Link
          </Button>
        }
      />
      <form
        id="create-link-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Link</DialogTitle>
            <DialogDescription>
              Tambah link di sini. Klik simpan jika sudah selesai.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Nama Link</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Slide Responsi MBL"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="course"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Mata Kuliah (Tidak Wajib Diisi)
                    </FieldLabel>
                    <Select
                      id={field.name}
                      name={field.name}
                      value={field.state.value == -1 ? null : field.state.value}
                      onValueChange={(e) => field.handleChange(e!)}
                      items={courseItems}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih mata kuliah" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {courseItems.map((course) => (
                            <SelectItem key={course.value} value={course.value}>
                              {course.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
            <form.Field
              name="url"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Link</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="url"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="https://ipb.link/responsi-mbl-ss23"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <DialogFooter>
            {submitError && (
              <p className="text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}
            <Button type="submit" form="create-link-form" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
