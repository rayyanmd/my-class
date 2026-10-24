"use client";

import * as React from "react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  data,
  active,
}: {
  data: {
    user: {
      name: string;
      nim: string;
      role: string;
    };
    navMain: {
      title: string;
      href: string;
      icon?: React.ReactNode;
    }[];
    navAdmin: {
      title: string;
      href: string;
      icon?: React.ReactNode;
    }[];
  };
  active: string;
}) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
            >
              <h1 className="font-bold text-xl">SS23's workshop</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} active={active} />
        {data.user.role == "admin" && (
          <NavMain title="Admin" items={data.navAdmin} active={active} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
