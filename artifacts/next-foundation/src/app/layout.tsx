import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});
import NavBar from "@/components/shared/navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js Foundation",
  description: "A minimal Next.js App Router foundation.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
