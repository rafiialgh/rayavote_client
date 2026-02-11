import type { Metadata } from "next";
import localFont from "next/font/local";
import { Crushed } from 'next/font/google'
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { ToastContainer } from "react-toastify"


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// const crushed = Crushed({
//   weight: '400',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  title: "Raya Vote",
  description: "Make your vote count!",
  
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className="bg-white"
      >
        {children}
      <ToastContainer theme="colored" />
      </body>
    </html>
  );
}
