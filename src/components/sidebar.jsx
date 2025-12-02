"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./button";
import { Chevron, Logout } from "./icons";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // pastikan route sesuai struktur project
  const navRoutes = {
    "Draft APBDes": "/APBDes/output-draft-apbdes",
    "Draft Penjabaran APBDes": "/APBDes/output-draft-penjabaran",
    "Buku APBDes": "/APBDes/buku-apbdes",
    "Rencana Kegiatan dan Anggaran": "/Rencana/RKA",
    "Rencana Kerja Kegiatan": "/Rencana/RKK",
    "Rencana Anggaran Biaya": "/Rencana/RAB",
    "Buku Kas Umum": "/Penatausahaan/BKU",
    "Buku Pembantu Pajak": "/Penatausahaan/Pajak",
    "Buku Pembantu Panjar": "/Penatausahaan/Panjar",
    "Buku Pembantu Kegiatan": "/Penatausahaan/Kegiatan",
    "Buku Bank Desa": "/Penatausahaan/Bank",
    "Laporan Realisasi Akhir Tahun": "/Laporan/AkhirTahun",
  };

  const listNav = [
    { title: "APBDes", subItems: ["Draft APBDes", "Draft Penjabaran APBDes", "Buku APBDes"] },
    {
      title: "Rencana & Kegiatan",
      subItems: [
        "Rencana Kegiatan dan Anggaran",
        "Rencana Kerja Kegiatan",
        "Rencana Anggaran Biaya",
      ],
    },
    {
      title: "Penatausahaan",
      subItems: [
        "Buku Kas Umum",
        "Buku Pembantu Pajak",
        "Buku Pembantu Panjar",
        "Buku Pembantu Kegiatan",
        "Buku Bank Desa",
      ],
    },
    {
      title: "Laporan Akhir",
      subItems: ["Laporan Realisasi Akhir Tahun"],
    },
  ];

  return (
    <aside className="sticky top-0 left-0 flex max-h-screen min-h-screen w-66 flex-col justify-between bg-[#3D3D3D] px-6 py-8 text-white">
      <div>
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-lg font-semibold">Kepala Desa</h2>
          <p className="text-sm text-gray-300">Desa Banguntapan</p>
          <div className="mt-4 mb-3 h-20 w-20 rounded-full bg-gray-400"></div>
          <p className="font-medium">Sudaryono</p>
          <p className="text-sm text-gray-300">9232753828</p>
        </div>

        <hr className="my-6 border-gray-600" />

        <nav className="space-y-3">
          <div>
            <h3 className="font-semibold text-white">Beranda</h3>
          </div>

          {listNav.map((item) => (
            <div key={item.title}>
              <div
                onClick={() => toggleMenu(item.title)}
                className="w-full cursor-pointer px-2 py-1 rounded-md hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <Chevron open={openMenu === item.title} />
                </div>
              </div>

              {openMenu === item.title && (
                <ul className="mt-2 space-y-1 font-medium">
                  {item.subItems.map((subItem) => {
                    const route = navRoutes[subItem] || "#";
                    const active = pathname === route;
                    return (
                      <li key={subItem}>
                        <Link
                          href={route}
                          className={`block w-full py-1 px-3 rounded-md ${
                            active
                              ? "text-white font-light"
                              : "text-gray-300 hover:text-white"
                          }`}
                        >
                          {subItem}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div>
        <Button variant="neutral">
          <Logout />
          <span>Keluar</span>
        </Button>
      </div>
    </aside>
  );
}
