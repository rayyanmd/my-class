export const instant = false;

import MainSidebar from "@/components/sidebar/main-sidebar";
import { auth } from "@/lib/auth";
import {
  BookOpenIcon,
  CalendarDaysIcon,
  LayoutDashboardIcon,
  LibraryBigIcon,
} from "lucide-react";
import { headers } from "next/headers";

const data = {
  user: {
    name: "",
    nim: "",
  },
  navMain: [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Jadwal",
      href: "/jadwal",
      icon: <CalendarDaysIcon />,
    },
    {
      title: "Tugas",
      href: "/tugas",
      icon: <BookOpenIcon />,
    },
    {
      title: "Pusat Link",
      href: "/pusatlink",
      icon: <LibraryBigIcon />,
    },
  ],
};

export default async function Layout({ children }: LayoutProps<"/">) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  data.user.name = session?.user.name!;
  data.user.nim = session?.user.email.split("@")[0].toUpperCase()!;

  return <MainSidebar data={data}>{children}</MainSidebar>;
}
