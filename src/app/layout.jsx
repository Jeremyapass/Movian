import "./globals.css";
import TanstackProvider from "@/provider/tanstackProvider";
import { fonts } from "@/fonts/fonts";
import ClientLayout from "@/components/ClientLayout";

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
          <ClientLayout>{children}</ClientLayout>
        </TanstackProvider>
      </body>
    </html>
  );
}
