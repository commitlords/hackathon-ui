"use client";
import { useState, type PropsWithChildren, useEffect } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
  DarkThemeToggle,
  SidebarCollapse,
} from "flowbite-react";
import {
  HiClipboardList,
  HiInbox,
  HiDocumentText,
  HiCurrencyRupee,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiMenu,
  HiX,
  HiCalendar,
  HiLogout,
} from "react-icons/hi";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminDashboardLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const router = useRouter();

  return (
    <div className="flex h-screen w-full min-w-0 overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isSidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden dark:bg-gray-900/80"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside
        className={clsx(
          "transition-width fixed inset-y-0 left-0 z-50 flex flex-col border-r border-gray-200 bg-white duration-300 dark:border-gray-700 dark:bg-gray-900",
          isMobile
            ? isSidebarOpen
              ? "w-64"
              : "-translate-x-full"
            : isSidebarCollapsed
              ? "w-16"
              : "w-64",
        )}
      >
        <Sidebar
          aria-label="Admin Sidebar"
          collapsed={isSidebarCollapsed && !isMobile}
          className="flex h-full flex-1 flex-col"
        >
          {/* Sidebar Header Row */}
          <div
            className={clsx(
              "flex items-center border-b border-gray-200 p-4 dark:border-gray-700",
              isSidebarCollapsed && !isMobile && "justify-center",
            )}
          >
            {!isSidebarCollapsed ? (
              <>
                <Link href="/admin-dashboard" className="flex flex-col">
                  <SidebarLogo
                    href="/admin-dashboard"
                    img="/Logo.png"
                    imgAlt="LOKSamarth Logo"
                    className="!m-0 !p-0"
                  >
                    LOKSamarth
                  </SidebarLogo>
                  <span className="mt-1 font-bold text-gray-900 dark:text-white">
                    Admin
                  </span>
                </Link>
                {!isMobile && (
                  <button
                    onClick={toggleSidebarCollapse}
                    className="ml-auto text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                    aria-label="Toggle sidebar"
                  >
                    <HiChevronDoubleLeft className="h-6 w-6" />
                  </button>
                )}
              </>
            ) : (
              !isMobile && (
                <button
                  onClick={toggleSidebarCollapse}
                  className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  aria-label="Toggle sidebar"
                >
                  <HiChevronDoubleRight className="h-6 w-6" />
                </button>
              )
            )}
            {isMobile && !isSidebarCollapsed && (
              <button
                className="ml-auto rounded-lg p-2 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 focus:outline-none dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-600"
                aria-label="Close sidebar"
                onClick={() => setIsSidebarOpen(false)}
              >
                <HiX className="h-6 w-6" />
              </button>
            )}
          </div>
          <SidebarItems className="flex-1">
            <SidebarItemGroup>
              <SidebarItem
                href="/admin-dashboard/applications"
                icon={HiClipboardList}
              >
                Applications
              </SidebarItem>
              <SidebarItem href="/admin-dashboard/inbox" icon={HiInbox}>
                Inbox
              </SidebarItem>
              <SidebarItem
                href="/admin-dashboard/issue-certificate"
                icon={HiDocumentText}
              >
                Issue Certificate
              </SidebarItem>
              <SidebarCollapse icon={HiCurrencyRupee} label="Loan Disbursement">
                <SidebarItem href="/admin-dashboard/loan-requests">
                  Requests
                </SidebarItem>
                <SidebarItem href="/admin-dashboard/loan-status">
                  Status
                </SidebarItem>
              </SidebarCollapse>
              <SidebarItem href="/admin-dashboard/meetings" icon={HiCalendar}>
                Meetings
              </SidebarItem>
              <SidebarItem icon={HiLogout} onClick={() => { router.push('/'); }}>
                Logout
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </aside>
      {/* Main content */}
      <div
        className={clsx(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          !isMobile && (isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"),
        )}
      >
        {/* Mobile menu header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden dark:border-gray-700 dark:bg-gray-800">
          <button
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <HiMenu className="h-6 w-6" />
          </button>
          <Link href="/admin-dashboard" className="flex items-center">
            <Image
              src="/Logo.png"
              className="mr-3 h-8 w-auto"
              alt="LOKSamarth Logo"
              width={32}
              height={32}
            />
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              LOKSamarth
            </span>
          </Link>
        </header>

        <main className="relative flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="absolute top-4 right-4 hidden lg:block">
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
