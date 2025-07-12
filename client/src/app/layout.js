import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/contexts/NotificationContext";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "StackIt - Q&A Platform",
  description: "Modern Q&A platform for collaborative learning",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <NotificationProvider>
            <Navbar />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
