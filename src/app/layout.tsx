'use client'
import "./globals.css";
import Navbar from "./components/NavBar";
import AuthInitializer from "./components/AuthInitializer";
import Script from "next/script";
// import './path/to/cronJob';//הפעלת הבדיקה האוטומטית

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
  return (
    <html lang="en">
      <body
       
      >
        <AuthInitializer/>
        <Navbar />
        {children}
        <Script
        strategy="afterInteractive"
        src="https://cdn.enable.co.il/licenses/enable-L353865821g3r7h0-1224-66930/init.js"
        onLoad={() => {
          console.log('ENABLE script loaded');
        }}
      />
        {/* <UseCallFrameDemo/> */}
      </body>
    </html>
  );
}
