"use client";
import { useState } from "react";
import { TopComponent } from "./top-container";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fontSize, setFontSize] = useState(16);
  return (
    <div style={{ fontSize }}>
      <TopComponent fontSize={fontSize} setFontSize={setFontSize} />
      {children}
    </div>
  );
}
