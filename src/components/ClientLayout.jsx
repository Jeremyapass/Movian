"use client";

import Navbar from "@/components/Molecules/Navbar";
import Footer from "@/components/Molecules/Footer";
import { RootProvider } from "@/provider/rootProvider";

export default function ClientLayout({ children }) {
  return (
    <RootProvider>
      <main className="flex flex-col items-center justify-center pt-[134px] px-[64px] w-full">
        <Navbar />
        {children}
      </main>
      <Footer />
    </RootProvider>
  );
}
