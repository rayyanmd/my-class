"use client";

import {
  CheckIcon,
  ClockIcon,
  MoreHorizontalIcon,
  PercentCircleIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { deleteAssignment, markDone } from "../actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditAssignment } from "./edit-assignment";
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
  courses,
}: {
  links: {
    id: number;
    title: string | null;
    course: string | null;
    url: string | null;
  }[];
  pj: boolean;
  courses: (typeof course.$inferSelect)[];
}) {
  const router = useRouter();

  // admin

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedAssignment, setAssignment] = useState<{
    id: number;
    title: string | null;
    course: string | null;
    deadline: Date | null;
    type: "individual" | "group" | null;
    guide: string | null;
    submission: string | null;
  }>({
    id: -1,
    title: "",
    course: "",
    deadline: null,
    type: null,
    guide: null,
    submission: null,
  });
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="rounded-md border">
      <EditAssignment
        assignment={selectedAssignment}
        courses={courses}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
      />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ngga bisa balik lagi kalo udah dihapus. Ini buat hapus tugas ini
              untuk semua orang.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                setIsPending(true);
                await deleteAssignment(selectedAssignment.id);
                setIsDeleting(false);
                setIsPending(false);
                toast.success("Tugas berhasil dihapus");
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
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAssignments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-8 text-center text-muted-foreground"
              >
                yey ngga ada tugas
              </TableCell>
            </TableRow>
          ) : (
            sortedAssignments.map((assignment) => {
              const isCompleted = completedAssignments.includes(assignment.id);

              return (
                <TableRow
                  key={assignment.id}
                  className={
                    isCompleted
                      ? "bg-secondary text-muted-foreground line-through"
                      : undefined
                  }
                >
                  <TableCell>{assignment.title}</TableCell>
                  <TableCell>{assignment.course}</TableCell>
                  <TableCell>
                    {assignment.type == "individual" ? "Individu" : "Kelompok"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getDeadlineVariant(assignment.deadline)}>
                      {formatDeadline(assignment.deadline)}
                    </Badge>
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
                      <DropdownMenuContent align="end">
                        {pj && (
                          <>
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>
                                Menu PJ Matkul
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setAssignment(assignment);
                                  setIsEditing(true);
                                }}
                              >
                                Ubah
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => {
                                  setAssignment(assignment);
                                  setIsDeleting(true);
                                }}
                              >
                                Hapus
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        <DropdownMenuGroup>
                          {assignment.guide && (
                            <Link href={assignment.guide} target="_blank">
                              <DropdownMenuItem>
                                Panduan Pengerjaan
                              </DropdownMenuItem>
                            </Link>
                          )}
                          {assignment.submission && (
                            <Link href={assignment.submission} target="_blank">
                              <DropdownMenuItem>
                                Link Pengumpulan
                              </DropdownMenuItem>
                            </Link>
                          )}
                          {(assignment.guide || assignment.submission) && (
                            <DropdownMenuSeparator />
                          )}
                          <DropdownMenuItem
                            onClick={async () => {
                              await markDone(assignment.id);
                              router.refresh();
                            }}
                          >
                            {isCompleted ? "Tandai Belum" : "Tandai Sudah"}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
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
