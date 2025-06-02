import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header";
import { LanguageProvider, useLanguage } from "@/contexts/language-context"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { LogoutButton } from "@/components/logout-button"
import { ShoppingCart } from "lucide-react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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
    <html>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LanguageProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <AppHeader />
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
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', () => {
                document.documentElement.classList.add('loaded');
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
