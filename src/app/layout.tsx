'use client'
import "./globals.css";
import Navbar from "./components/NavBar";
import AuthInitializer from "./components/AuthInitializer";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body

      >
        <AuthInitializer />
        <Toaster />
        <Navbar />
        {children}
        <Script
          strategy="afterInteractive"
          src="https://cdn.enable.co.il/licenses/enable-L353865821g3r7h0-1224-66930/init.js"
          onLoad={() => {
            console.log('ENABLE script loaded');
          }}
        />
      </body>
    </html>
  );
}
