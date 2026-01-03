import Navbar from "@/components/Molecules/Navbar";
import "./globals.css";
import TanstackProvider from "@/provider/tanstackProvider";
import Footer from "@/components/Molecules/Footer";
import { fonts } from "@/fonts/fonts";
import { RootProvider } from "@/provider/rootProvider";

export const metadata = {
  title: "Movian",
  description: "A movie discovery app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-[#0D0D0D] min-h-screen text-white ${fonts.satoshi.className}`}
      >
        <TanstackProvider>
          <RootProvider>
            <main className="flex flex-col items-center justify-center pt-[134px] px-[64px] w-full">
              <Navbar />
              {children}
            </main>
          </RootProvider>

          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
