import type { ReactNode } from "react";
import NavBar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer" 

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
}
