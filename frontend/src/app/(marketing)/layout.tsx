import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Marketing",
  description: "DeliveryOS marketing pages",
};

export default function MarketingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      
      <main>{children}
       <Navbar />  
       <Footer />
      </main>
    </div>
  );
}
