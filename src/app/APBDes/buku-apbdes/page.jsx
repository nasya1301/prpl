"use client";

import { useEffect, useState } from "react";
import BreadCrumb from "@/components/breadCrumb";

export default function BukuAPBDes() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Ambil data hasil posting dari localStorage
    const posted = JSON.parse(localStorage.getItem("apbdesPosted") || "[]");
    setData(posted);
  }, []);

  const total = (kategori) => {
    if (!data || data.length === 0) return 0;
    return data
      .filter((item) => item.pendapatanBelanja === kategori)
      .reduce((sum, item) => sum + Number(item.anggaran || 0), 0);
  };

  const getItems = (kategori) => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => item.pendapatanBelanja === kategori);
  };

  const renderBox = (title, kategori) => {
    const items = getItems(kategori);

    return (
      <div className="rounded-2xl bg-white">
        {/* Header */}
        <div className="flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 mb-4 relative w-full min-w-[900px]">
          <h3 className="text-base font-semibold text-[#011829] absolute left-4">
            {title}
          </h3>

          <p className="text-sm text-gray-700 font-medium">
            Total{" "}
            <span className="font-bold text-black">
              Rp{total(kategori).toLocaleString("id-ID", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[180px]">
          {items.length > 0 ? (
            <div className="divide-y divide-gray-300">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-2 px-2"
                >
                  <div className="flex items-center text-sm text-gray-800 space-x-1">
                    <span>{item.uraian2 || "Pendapatan Transfer"}</span>
                  </div>
                  <div className="text-sm font-light text-black">
                    Rp{Number(item.anggaran || 0).toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic px-2 py-3">
              Tidak ada data {kategori.toLowerCase()}.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white px-6 md:px-16 py-8">
      {/* Tetap tampil di semua kondisi */}
      <BreadCrumb category="APBDes" title="Buku APBDes" />

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          APBDes
        </h1>
        <h3 className="text-sm font-normal text-gray-700 mt-1">
          Anggaran Pendapatan dan Belanja Pemerintah Desa BANGUNTAPAN Tahun
          Anggaran 2025
        </h3>
      </div>

      {/* Kondisi belum ada posting */}
      {(!data || data.length === 0) ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <p className="text-gray-500 text-lg font-medium">
            ! PPKD belum melakukan posting APBDes !
          </p>
        </div>
      ) : (
        // Jika sudah ada data posting
        <div className="space-y-8">
          {renderBox("Pendapatan", "Pendapatan")}
          {renderBox("Belanja", "Belanja")}
          {renderBox("Pembiayaan", "Pembiayaan")}
        </div>
      )}
    </main>
  );
}
