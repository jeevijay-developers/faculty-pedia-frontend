import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import { HeroUIProvider } from "@heroui/react";
import { AlertContainer } from "@/components/CustomAlert";
import ModernToaster from "@/components/LiveTest/ModernToaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Faculty Pedia - Educational Platform",
  description:
    "Comprehensive educational platform for exams, classes, courses, webinars, and educators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/logo-blue.png" type="image/png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <HeroUIProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <AlertContainer />
          <ModernToaster />
        </HeroUIProvider>
      </body>
    </html>
  );
}
