"use client";

import { MoreHorizontalIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteLink } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { course } from "@/db/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function PusatLinkList({
  links,
  pj,
}: {
  links: {
    id: number;
    title: string | null;
    course: string | null;
    url: string | null;
  }[];
  pj: boolean;
}) {
  const router = useRouter();

  // admin

  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedLink, setLink] = useState<{
    id: number;
    title: string | null;
    course: string | null;
    url: string | null;
  }>({
    id: -1,
    title: "",
    course: "",
    url: "",
  });
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="rounded-md border">
      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ngga bisa balik lagi kalo udah dihapus. Ini buat hapus link ini
              untuk semua orang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                setIsPending(true);
                await deleteLink(selectedLink.id);
                setIsDeleting(false);
                setIsPending(false);
                toast.success("Link berhasil dihapus");
                router.refresh();
              }}
              disabled={isPending}
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Mata Kuliah Terkait</TableHead>
            <TableHead>Link</TableHead>
            {pj && <TableHead className="w-0" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                gaada link samsek
              </TableCell>
            </TableRow>
          ) : (
            links.map((link) => {
              return (
                <TableRow key={link.id}>
                  <TableCell>{link.title}</TableCell>
                  <TableCell>{link.course ? link.course : "-"}</TableCell>
                  <TableCell>
                    <a
                      href={link.url as string}
                      target="_blank"
                      className="underline"
                    >
                      {link.url}
                    </a>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8"
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        }
                      />
                      {pj && (
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>
                              Menu PJ Matkul
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => {
                                setLink(link);
                                setIsDeleting(true);
                              }}
                            >
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
