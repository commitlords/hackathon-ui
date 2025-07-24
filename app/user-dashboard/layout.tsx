"use client";
import { useState, type PropsWithChildren, useEffect } from "react";
import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
  SidebarLogo,
  DarkThemeToggle,
} from "flowbite-react";
import {
  HiChartPie,
  HiLogout,
  HiUsers,
  HiMenu,
  HiX,
  HiCalendar,
  HiClipboardList,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
} from "react-icons/hi";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserDashboardLayout({ children }: PropsWithChildren) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(false); // Ensure mobile overlay is closed on desktop
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check
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
          aria-label="Sidebar with logo branding example"
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
                <Link href="/user-dashboard">
                  <SidebarLogo
                    href="/user-dashboard"
                    img="/Logo.png"
                    imgAlt="LOKSamarth Logo"
                    className="!m-0 !p-0"
                  >
                    LOKSamarth
                  </SidebarLogo>
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
                href="/user-dashboard"
                icon={HiChartPie}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                Dashboard
              </SidebarItem>
              <SidebarItem
                href="/user-dashboard/members"
                icon={HiUsers}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                Members
              </SidebarItem>
              <SidebarItem
                href="/user-dashboard/submit-application"
                icon={HiClipboardList}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                Submit Application
              </SidebarItem>
              <SidebarItem
                href="/user-dashboard/meetings"
                icon={HiCalendar}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                Meetings
              </SidebarItem>
              <SidebarItem
                icon={HiLogout}
                onClick={() => {
                  router.push("/");
                }}
              >
                Logout
              </SidebarItem>
            </SidebarItemGroup>
          </SidebarItems>
        </Sidebar>
      </aside>

      <div
        className={clsx(
          "flex min-w-0 flex-1 flex-col transition-all duration-300",
          !isMobile && (isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"),
        )}
      >
        {/* Top bar with hamburger menu */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white p-4 lg:hidden dark:border-gray-700 dark:bg-gray-800">
          <button
            aria-label="Open sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <HiMenu className="h-6 w-6" />
          </button>
          <Link href="/user-dashboard" className="flex items-center">
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
          <DarkThemeToggle />
        </header>

        {/* Main Content */}
        <main className="relative flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 lg:p-8">
          <div className="absolute top-4 right-4 hidden lg:block">
            <DarkThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
