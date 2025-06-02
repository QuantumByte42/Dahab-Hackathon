import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/app/globals.css";

import { AppSidebar } from "@/components/app-sidebar";
import { LanguageProvider } from "@/contexts/language-context";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { LogoutButton } from "@/components/logout-button";
import { ShoppingCart } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
});

export const metadata: Metadata = {
  title: "نظام نقاط البيع - لوحة التحكم",
  description: "لوحة تحكم المسؤول لنظام نقاط بيع متجر الذهب",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} antialiased`}>
        <LanguageProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 bg-gradient-to-r p-6">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">مستخدم المدير</p>
                    <p className="text-xs text-gray-500">مدير النظام</p>
                  </div>
                  <LogoutButton />
                </div>
              </header>
              <main className="flex-1 overflow-hidden bg-gray-50/30 p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </LanguageProvider>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  );
}
