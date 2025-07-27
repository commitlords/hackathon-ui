"use client";
import { type PropsWithChildren } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  HiChartPie,
  HiUsers,
  HiClipboardList,
  HiCalendar,
} from "react-icons/hi";


const sidebarItems = [
    { href: "/user-dashboard", icon: HiChartPie, label: "Dashboard" },
    { href: "/user-dashboard/members", icon: HiUsers, label: "Members" },
    { href: "/user-dashboard/submit-application", icon: HiClipboardList, label: "Submit Application" },
    { href: "/user-dashboard/meetings", icon: HiCalendar, label: "Meetings" },
];

export default function UserDashboardLayout({ children }: PropsWithChildren) {
  return (
        <DashboardLayout sidebarItems={sidebarItems} dashboardName="User">
            {children}
        </DashboardLayout>
    );
}