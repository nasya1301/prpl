import Sidebar from "@/components/sidebar";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function DraftAPBDesLayout({ children }) {
  return (
    <div className={`${inter.className} flex min-h-screen bg-white text-gray-900`}>
      {/* Sidebar tetap di kiri */}
      <Sidebar />

      {/* Area utama halaman */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

