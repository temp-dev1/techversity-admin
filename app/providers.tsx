"use client";

import { ThemeProvider } from "next-themes";
import { CustomToaster } from "@/components/ui/custom-toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <CustomToaster />
    </ThemeProvider>
  );
}