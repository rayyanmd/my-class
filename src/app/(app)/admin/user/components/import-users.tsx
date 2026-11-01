"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UploadIcon } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { importUsers } from "../actions";

const expectedHeaders = ["name", "nim", "password", "role"];
const validRoles = new Set(["user", "pj", "admin"]);

function parseCsv(value: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const next = value[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some((item) => item.trim())) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (quoted) throw new Error("CSV memiliki tanda kutip yang tidak lengkap");
  row.push(cell);
  if (row.some((item) => item.trim())) rows.push(row);
  return rows;
}

export default function ImportUsers() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const reset = () => {
    setFileName("");
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    const file = inputRef.current?.files?.[0];
    if (!file) {
      setError("Pilih file CSV terlebih dahulu.");
      return;
    }

    try {
      const rows = parseCsv((await file.text()).replace(/^\uFEFF/, ""));
      if (
        rows.length === 0 ||
        rows[0].map((header) => header.trim().toLowerCase()).join(",") !==
          expectedHeaders.join(",")
      ) {
        setError("Header CSV harus: name,nim,password,role");
        return;
      }
      if (rows.length === 1) {
        setError("CSV harus memiliki setidaknya satu user.");
        return;
      }

      const parsedRows = rows.slice(1).map((cells, index) => ({
        row: index + 2,
        cellCount: cells.length,
        name: cells[0] ?? "",
        username: cells[1] ?? "",
        password: cells[2] ?? "",
        role: cells[3] ?? "",
      }));
      const malformed = parsedRows.find(
        (row) =>
          row.cellCount !== expectedHeaders.length ||
          !validRoles.has(row.role.trim().toLowerCase()),
      );
      if (malformed) {
        setError(`Format atau role tidak valid pada baris ${malformed.row}.`);
        return;
      }

      startTransition(async () => {
        try {
          const failures = await importUsers(parsedRows);
          if (failures.length) {
            setError(
              `${parsedRows.length - failures.length} user berhasil diimpor. ` +
                `Baris gagal: ${failures.map((failure) => failure.row).join(", ")}.`,
            );
            router.refresh();
            return;
          }
          toast.success(`${parsedRows.length} user berhasil diimpor`);
          setIsOpen(false);
          reset();
          router.refresh();
        } catch (importError) {
          setError(
            importError instanceof Error
              ? importError.message
              : "CSV gagal diimpor. Silakan coba lagi.",
          );
        }
      });
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "File CSV gagal diproses.",
      );
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger render={<Button variant="outline"><UploadIcon /> Impor CSV</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impor User dari CSV</DialogTitle>
          <DialogDescription>
            Format wajib: <code>name,nim,password,role</code>. Role yang
            tersedia: user, pj, admin.
          </DialogDescription>
        </DialogHeader>
        <Input
          ref={inputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => {
            setError(null);
            setFileName(event.target.files?.[0]?.name ?? "");
          }}
          disabled={isPending}
        />
        {fileName && <p className="text-sm text-muted-foreground">{fileName}</p>}
        {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
        <DialogFooter>
          <Button onClick={handleUpload} disabled={isPending}>
            {isPending ? "Mengimpor..." : "Impor"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
