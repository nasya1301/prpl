"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import BreadCrumb from "@/components/breadCrumb";
import Button from "@/components/button";
import { ArrowUpRight, Download, SquarePlus, Pencil } from "@/components/icons";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function OutputAPBDes() {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const [penjabaranData, setPenjabaranData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper: normalize amount fields across different shapes returned by API
  const amountOf = (item) => {
    if (!item) return 0;
    return Number(item.jumlah_anggaran ?? item.anggaran ?? item.jumlahAnggaran ?? item.jumlah ?? 0) || 0;
  };

  // API-only loader: will NOT fallback to localStorage
  const loadFromApi = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!API) throw new Error("Environment variable NEXT_PUBLIC_API_BASE_URL belum diset.");

      // Fetch rincian dan penjabaran in parallel
      const [rRes, pRes] = await Promise.all([fetch(`${API}/draft/rincian`), fetch(`${API}/draft/penjabaran`)]);

      // Check responses
      if (!rRes.ok) {
        const txt = await rRes.text().catch(() => "");
        throw new Error(`Gagal memuat rincian: ${rRes.status} ${txt}`);
      }
      if (!pRes.ok) {
        const txt = await pRes.text().catch(() => "");
        throw new Error(`Gagal memuat penjabaran: ${pRes.status} ${txt}`);
      }

      // Parse JSON
      const rjson = await rRes.json();
      const pjson = await pRes.json();

      // Support both { data: [...] } and [...] response shapes
      const newData = Array.isArray(rjson.data ?? rjson) ? (rjson.data ?? rjson) : [];
      const newPenjabaran = Array.isArray(pjson.data ?? pjson) ? (pjson.data ?? pjson) : [];

      setData(newData);
      setPenjabaranData(newPenjabaran);
    } catch (err) {
      console.error("Load from API failed:", err);
      setError(err.message || String(err));
      setData([]); // clear data so UI reflects no results
      setPenjabaranData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load + reload on pathname change
  useEffect(() => {
    loadFromApi();

    // Reload when visibility changes or custom events are fired (still useful)
    const handleApbdesUpdate = () => loadFromApi();
    const handlePenjabaranUpdate = () => loadFromApi();
    const handleVisibilityChange = () => {
      if (!document.hidden) loadFromApi();
    };

    window.addEventListener("apbdes:update", handleApbdesUpdate);
    window.addEventListener("penjabaran:update", handlePenjabaranUpdate);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("apbdes:update", handleApbdesUpdate);
      window.removeEventListener("penjabaran:update", handlePenjabaranUpdate);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Utility: compute total for category
  const total = (kategori) => {
    if (!data || data.length === 0) return 0;

    const allItems = data.filter(
      (item) => String(item.pendapatanBelanja ?? item.kategori ?? "").toLowerCase() === kategori.toLowerCase()
    );

    return allItems.reduce((sum, item) => {
      const penjabaranSum = (penjabaranData || [])
        .filter((p) => String(p.rincian_id) === String(item.id))
        .reduce((s, p) => s + amountOf(p), 0);

      const itemTotal = Math.max(amountOf(item), penjabaranSum);
      return sum + itemTotal;
    }, 0);
  };

  const getItems = (kategori) => {
    if (!data || data.length === 0) return [];

    const filtered = data.filter(
      (item) => String(item.pendapatanBelanja ?? item.kategori ?? "").toLowerCase() === kategori.toLowerCase()
    );

    const hasLevelProperty = filtered.some((item) => item.level);
    if (hasLevelProperty) {
      return filtered.filter((item) => (item.level ?? "").toLowerCase() === "kelompok" || !item.parent_id);
    }

    return filtered;
  };

  const getJenisItems = (parentId) => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => String(item.parent_id) === String(parentId) && (item.level ?? "").toLowerCase() === "jenis");
  };

  const getObjekItems = (parentId) => {
    if (!data || data.length === 0) return [];
    return data.filter((item) => String(item.parent_id) === String(parentId) && (item.level ?? "").toLowerCase() === "objek");
  };

  // Posting: call backend; do NOT fallback to localStorage
  const handlePostingAPB = async () => {
    if (!data || data.length === 0) {
      alert("Belum ada data yang dapat diposting.");
      return;
    }

    if (!API) {
      alert("Tidak dapat memposting: NEXT_PUBLIC_API_BASE_URL belum diset.");
      return;
    }

    try {
      // Ganti endpoint jika backend Anda punya route lain untuk posting final
      const res = await fetch(`${API}/post/apbdes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apbdes: data, penjabaran: penjabaranData }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Gagal memposting ke server: ${res.status} ${txt}`);
      }

      const resp = await res.json().catch(() => ({}));
      alert(resp.message || "✅ APBDes berhasil diposting ke server.");
      // after successful post, navigate to Buku APBDes
      router.push("/APBDes/buku-apbdes");
    } catch (err) {
      console.error("Posting failed:", err);
      alert(`❌ Gagal memposting: ${err.message || String(err)}`);
    }
  };

  const renderBox = (title, kategori) => {
    const items = getItems(kategori);

    return (
      <div className="rounded-2xl bg-white" key={kategori}>
        {/* Header */}
        <div className="flex items-center justify-center rounded-full border border-gray-300 px-5 py-3 mb-4 relative w-full min-w-[900px]">
          <h3 className="text-base font-semibold text-[#011829] absolute left-4">{title}</h3>

          <p className="text-sm text-gray-700 font-medium">
            Total{" "}
            <span className="font-bold text-black">
              Rp{total(kategori).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[180px]">
          {items.length > 0 ? (
            <div className="divide-y divide-gray-300">
              {items.map((item, idx) => {
                const itemPenjabaran = penjabaranData.filter((p) => String(p.rincian_id) === String(item.id));
                const penjabaranSum = itemPenjabaran.reduce((s, p) => s + amountOf(p), 0);
                const parentTotal = Math.max(amountOf(item), penjabaranSum);

                const jenisItems = getJenisItems(item.id);

                return (
                  <div key={item.id ?? idx}>
                    <div className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition">
                      <div className="flex items-center text-sm text-gray-800 space-x-2">
                        <span className="font-semibold">
                          {item.kelompok ?? item.jenis ?? item.objek ?? item.uraian ?? "Tidak ada uraian"}
                        </span>
                        <button
                          className="ml-1 text-gray-600 hover:text-gray-900 transition"
                          onClick={() => router.push(`/APBDes/input-draft-penjabaran?rincian_id=${item.id}`)}
                          title="Tambah penjabaran"
                        >
                          <SquarePlus width={20} height={20} />
                        </button>
                      </div>
                      <div className="text-sm font-light text-black">
                        Rp{parentTotal.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                      </div>
                    </div>

                    {/* Penjabaran of this item */}
                    {itemPenjabaran.length > 0 && (
                      <div className="ml-8 border-l-2 border-gray-200 pl-4">
                        {itemPenjabaran.map((penjabaran, pIdx) => (
                          <div
                            key={penjabaran.id ?? pIdx}
                            className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition text-gray-700"
                          >
                            <div className="flex items-center text-sm space-x-2">
                              <span>{penjabaran.objek ?? penjabaran.jenis ?? penjabaran.kelompok ?? "Penjabaran"}</span>
                              <button
                                className="ml-1 text-blue-600 hover:text-blue-800 transition"
                                onClick={() => router.push(`/APBDes/input-draft-penjabaran?id=${penjabaran.id}&rincian_id=${item.id}`)}
                                title="Edit penjabaran"
                              >
                                <Pencil width={16} height={16} />
                              </button>
                            </div>
                            <div className="text-sm font-light">
                              Rp{amountOf(penjabaran).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Jenis children */}
                    {jenisItems.length > 0 && (
                      <div className="ml-6 border-l-2 border-blue-200 pl-4">
                        {jenisItems.map((jenisItem, jIdx) => {
                          const jenisPenjabaran = penjabaranData.filter((p) => String(p.rincian_id) === String(jenisItem.id));
                          const jenisPenjabaranSum = jenisPenjabaran.reduce((s, p) => s + amountOf(p), 0);
                          const jenisTotal = Math.max(amountOf(jenisItem), jenisPenjabaranSum);

                          const objekItems = getObjekItems(jenisItem.id);

                          return (
                            <div key={jenisItem.id ?? `jenis-${jIdx}`} className="mt-1">
                              <div className="flex items-center justify-between py-2 px-2 hover:bg-blue-50 rounded-md transition">
                                <div className="flex items-center text-sm text-blue-800 space-x-2">
                                  <span className="font-medium">{jenisItem.jenis ?? "Tidak ada uraian"}</span>
                                  <button
                                    className="ml-1 text-blue-600 hover:text-blue-900 transition"
                                    onClick={() => router.push(`/APBDes/input-draft-penjabaran?rincian_id=${jenisItem.id}`)}
                                    title="Tambah item objek"
                                  >
                                    <SquarePlus width={18} height={18} />
                                  </button>
                                </div>
                                <div className="text-sm font-light text-blue-900">
                                  Rp{jenisTotal.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                                </div>
                              </div>

                              {jenisPenjabaran.length > 0 && (
                                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                                  {jenisPenjabaran.map((penjabaran, pIdx) => (
                                    <div
                                      key={penjabaran.id ?? pIdx}
                                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition text-gray-600"
                                    >
                                      <div className="flex items-center text-sm space-x-2">
                                        <span>{penjabaran.objek ?? penjabaran.jenis ?? penjabaran.kelompok ?? "Penjabaran"}</span>
                                        <button
                                          className="ml-1 text-blue-600 hover:text-blue-800 transition"
                                          onClick={() => router.push(`/APBDes/input-draft-penjabaran?id=${penjabaran.id}&rincian_id=${jenisItem.id}`)}
                                          title="Edit penjabaran"
                                        >
                                          <Pencil width={16} height={16} />
                                        </button>
                                      </div>
                                      <div className="text-sm font-light">
                                        Rp{amountOf(penjabaran).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Objek children */}
                              {objekItems.length > 0 && (
                                <div className="ml-6 border-l-2 border-green-200 pl-4">
                                  {objekItems.map((objekItem, oIdx) => {
                                    const objekPenjabaran = penjabaranData.filter((p) => String(p.rincian_id) === String(objekItem.id));
                                    const objekPenjabaranSum = objekPenjabaran.reduce((s, p) => s + amountOf(p), 0);
                                    const objekTotal = Math.max(amountOf(objekItem), objekPenjabaranSum);

                                    return (
                                      <div key={objekItem.id ?? `objek-${oIdx}`} className="mt-1">
                                        <div className="flex items-center justify-between py-2 px-2 hover:bg-green-50 rounded-md transition">
                                          <div className="flex items-center text-sm text-green-800 space-x-2">
                                            <span>{objekItem.objek ?? "Tidak ada uraian"}</span>
                                            <button
                                              className="ml-1 text-green-600 hover:text-green-900 transition"
                                              onClick={() => router.push(`/APBDes/input-draft-penjabaran?rincian_id=${objekItem.id}`)}
                                              title="Tambah penjabaran objek"
                                            >
                                              <SquarePlus width={16} height={16} />
                                            </button>
                                          </div>
                                          <div className="text-sm font-light text-green-900">
                                            Rp{objekTotal.toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                                          </div>
                                        </div>

                                        {objekPenjabaran.length > 0 && (
                                          <div className="ml-8 border-l-2 border-gray-200 pl-4">
                                            {objekPenjabaran.map((penjabaran, pIdx) => (
                                              <div
                                                key={penjabaran.id ?? pIdx}
                                                className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition text-gray-600"
                                              >
                                                <div className="flex items-center text-sm space-x-2">
                                                  <span>{penjabaran.objek ?? penjabaran.jenis ?? penjabaran.kelompok ?? "Penjabaran"}</span>
                                                  <button
                                                    className="ml-1 text-blue-600 hover:text-blue-800 transition"
                                                    onClick={() =>
                                                      router.push(`/APBDes/input-draft-penjabaran?id=${penjabaran.id}&rincian_id=${objekItem.id}`)
                                                    }
                                                    title="Edit penjabaran"
                                                  >
                                                    <Pencil width={16} height={16} />
                                                  </button>
                                                </div>
                                                <div className="text-sm font-light">
                                                  Rp{amountOf(penjabaran).toLocaleString("id-ID", { minimumFractionDigits: 2 })}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-400 text-sm italic px-2 py-3">Belum ada data {kategori.toLowerCase()} yang diinput.</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white px-6 md:px-16 py-8">
      <BreadCrumb category="APBDes" title="Draft Penjabaran APBDes" />

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Draft Penjabaran APBDes</h1>
          <h3 className="text-sm font-normal text-gray-700 mt-1">
            Penjabaran Anggaran Pendapatan dan Belanja Pemerintah Desa Tahun Anggaran
          </h3>
        </div>

        <div className="flex flex-col space-y-2">
          <Button
            variant="solid"
            className="bg-[#0779ce] hover:bg-[#066bb8] text-white flex items-center justify-between px-4 py-2 rounded-lg w-48 shadow-sm"
            onClick={handlePostingAPB}
            disabled={loading}
          >
            <span>Posting APB</span>
            <ArrowUpRight width={18} height={18} />
          </Button>

          <Button
            variant="solid"
            className="bg-[#ff9500] hover:bg-[#e68600] text-white flex items-center justify-between px-4 py-2 rounded-lg w-48 shadow-sm"
            onClick={() => alert("Fitur Unduh File belum diaktifkan")}
          >
            <span>Unduh File</span>
            <Download width={18} height={18} />
          </Button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-4">Memuat data dari server...</div>}
      {error && <div className="text-sm text-red-600 mb-4">Kesalahan: {error}</div>}

      <div className="space-y-8">
        {renderBox("Pendapatan", "Pendapatan")}
        {renderBox("Belanja", "Belanja")}
        {renderBox("Pembiayaan", "Pembiayaan")}
      </div>
    </main>
  );
}