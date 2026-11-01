"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontalIcon } from "lucide-react";
import EditUser from "./edit-user";
import { useState } from "react";
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
import { deleteUser } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UserList({
  users,
}: {
  users: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    role: "user" | "pj" | "admin";
    createdAt: Date;
    updatedAt: Date;
    lastSession: {
      ipAddress: string | null;
      userAgent: string | null;
    };
  }[];
}) {
  const router = useRouter();
  // admin

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUser, setUser] = useState<{
    id: string;
    username: string | null;
    name: string | null;
  }>({
    id: "",
    username: "",
    name: "",
  });
  const [isPending, setIsPending] = useState(false);

  return (
    <div className="rounded-md border">
      <EditUser
        user={selectedUser}
        isOpen={isEditing}
        setIsOpen={setIsEditing}
      />

      <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Ngga bisa balik lagi kalo udah dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                setIsPending(true);
                await deleteUser(selectedUser.id);
                setIsDeleting(false);
                setIsPending(false);
                toast.success("User berhasil dihapus");
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
            <TableHead>NIM</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Fakultas</TableHead>
            <TableHead>Jurusan</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="w-0" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email.split("@")[0].toUpperCase()}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                {user.email.toLowerCase().startsWith("m")
                  ? "Sekolah Sains Data, Matematika, dan Informatika"
                  : "Fakultas Ekonomi dan Manajemen"}
              </TableCell>
              <TableCell>Ilmu Komputer</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button variant="ghost" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    }
                  />
                  <DropdownMenuContent align="end">
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={async () => {
                          if (!user.lastSession?.ipAddress)
                            return toast.error(
                              "IP Address user tidak ditemukan",
                            );
                          await navigator.clipboard.writeText(
                            user.lastSession.ipAddress,
                          );
                          toast.success("IP Address berhasil disalin");
                        }}
                      >
                        Copy IP Address Terakhir
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          if (!user.lastSession?.userAgent)
                            return toast.error(
                              "User Agent user tidak ditemukan",
                            );
                          await navigator.clipboard.writeText(
                            user.lastSession.userAgent,
                          );
                          toast.success("User Agent berhasil disalin");
                        }}
                      >
                        Copy User Agent Terakhir
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => {
                          setUser({
                            id: user.id,
                            username: user.email.split("@")[0].toUpperCase(),
                            name: user.name,
                          });
                          setIsEditing(true);
                        }}
                      >
                        Ubah
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => {
                          setUser({
                            id: user.id,
                            username: user.email.split("@")[0].toUpperCase(),
                            name: user.name,
                          });
                          setIsDeleting(true);
                        }}
                      >
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
