import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { AppSidebar } from "@/components/app-sidebar"
import { LanguageProvider } from "@/contexts/language-context"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LogoutButton } from "@/components/logout-button"
import { ShoppingCart } from "lucide-react"


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gold Store POS - Admin Dashboard",
  description: "Admin dashboard for gold store point of sale system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-gradient-to-r from-amber-50 to-yellow-50">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-sm">
                      <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <span className="font-bold text-gray-900">Gold Store POS</span>
                      <p className="text-xs text-amber-600 font-medium">Admin Dashboard</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-500">System Administrator</p>
                  </div>
                  <LogoutButton />
                </div>
              </header>
              <main className="flex-1 overflow-hidden bg-gray-50/30">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
