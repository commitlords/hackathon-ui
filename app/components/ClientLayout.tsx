"use client";
import { useState } from "react";
import { TopComponent } from "./top-container";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useState(16);
  const pathname = usePathname();
  const hideTopContainer = [
    "/register",
    "/user-login",
    "/admin-login",
  ].includes(pathname);
  return (
    <div style={{ fontSize }}>
      {!hideTopContainer && (
        <TopComponent fontSize={fontSize} setFontSize={setFontSize} />
      )}
      {children}
    </div>
  );
}
