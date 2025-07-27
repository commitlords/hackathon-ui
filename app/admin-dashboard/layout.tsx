"use client";
import { type PropsWithChildren } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import {
  HiClipboardList,
  HiInbox,
  HiDocumentText,
  HiCurrencyRupee,
  HiCalendar,
} from "react-icons/hi";

const sidebarItems = [
    { href: "/admin-dashboard/applications", icon: HiClipboardList, label: "Applications" },
    { href: "/admin-dashboard/inbox", icon: HiInbox, label: "Inbox" },
    { href: "/admin-dashboard/issue-certificate", icon: HiDocumentText, label: "Issue Certificate" },
    {
        icon: HiCurrencyRupee,
        label: "Loan Disbursement",
        items: [
            { href: "/admin-dashboard/loan-requests", label: "Requests", icon: HiCurrencyRupee },
            { href: "/admin-dashboard/loan-status", label: "Status", icon: HiCurrencyRupee },
        ],
    },
    { href: "/admin-dashboard/meetings", icon: HiCalendar, label: "Meetings" },
];

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
    return (
        <DashboardLayout sidebarItems={sidebarItems} dashboardName="Admin">
            {children}
        </DashboardLayout>
    );
}