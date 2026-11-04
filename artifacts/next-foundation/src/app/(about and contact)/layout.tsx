import type { ReactNode } from "react";
import NavBar from "@/components/shared/navbar";
import 

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
