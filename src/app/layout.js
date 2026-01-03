/* eslint-disable @next/next/no-page-custom-font */
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Common/Navbar";
import Footer from "../components/Common/Footer";
import ChromeVisibility from "../components/Common/ChromeVisibility";
import { HeroUIProvider } from "@heroui/react";
import { AlertContainer } from "@/components/CustomAlert";
import ModernToaster from "@/components/LiveTest/ModernToaster";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Facultypedia - Educational Platform",
  description:
    "Comprehensive educational platform for exams, classes, courses, webinars, and educators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo/logo-blue.png" type="image/png" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
        suppressHydrationWarning={true}
      >
        <HeroUIProvider>
          <ChromeVisibility>
            <Navbar />
          </ChromeVisibility>
          <main className="grow">{children}</main>
          <ChromeVisibility>
            <Footer />
          </ChromeVisibility>
          <AlertContainer />
          <ModernToaster />
          <Toaster />
          <Script
            src="https://checkout.razorpay.com/v1/checkout.js"
            strategy="beforeInteractive"
          />
        </HeroUIProvider>
      </body>
    </html>
  );
}
