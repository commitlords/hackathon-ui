"use client";

import { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation"; // Import the usePathname hook
import { TopComponent } from "./top-container";
import { Header } from "./Header.jsx";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useState(16);

  // Get the current URL path
  const pathname = usePathname();

  // Check if the current page is a dashboard page - memoized to prevent re-renders
  const isDashboardPage = useMemo(
    () =>
      pathname.startsWith("/user-dashboard") ||
      pathname.startsWith("/admin-dashboard"),
    [pathname],
  );

  useEffect(() => {
    // Only update if fontSize has actually changed
    const currentFontSize = document.documentElement.style.fontSize;
    const newFontSize = `${fontSize}px`;

    if (currentFontSize !== newFontSize) {
      document.documentElement.style.fontSize = newFontSize;
    }
  }, []);

  return (
    <div>
      <TopComponent fontSize={fontSize} setFontSize={setFontSize} />

      {/* --- FIX: Only show the Header on non-dashboard pages --- */}
      {!isDashboardPage && <Header />}

      <main>{children}</main>
    </div>
  );
}
