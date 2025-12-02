"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BreadCrumb from "@/components/breadCrumb";
import Button from "@/components/button";
import { ArrowUpRight, Download, Plus, SquarePlus, Pencil } from "@/components/icons";

export default function OutputAPBDes() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [penjabaranData, setPenjabaranData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kodeEkonomiMap, setKodeEkonomiMap] = useState({});
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Helpers: sanitize anggaran and tolerant category matching
  const sanitizeNumber = (val) => {
    if (val === null || val === undefined) return 0;
    const s = String(val).replace(/\s/g, "").replace(/[^0-9.,-]/g, "");
    if (s.indexOf(',') > -1 && s.indexOf('.') > -1) {
      return Number(s.replace(/\./g, '').replace(',', '.')) || 0;
    }
    if (s.indexOf('.') > -1 && s.indexOf(',') === -1) {
      if ((s.match(/\./g) || []).length > 1) {
        return Number(s.replace(/\./g, '')) || 0;
      }
      return Number(s) || 0;
    }
    if (s.indexOf(',') > -1) return Number(s.replace(',', '.')) || 0;
    return Number(s) || 0;
  };

  // Fetch kode ekonomi untuk mapping ID ke uraian
  const fetchKodeEkonomi = async () => {
    try {
      const res = await fetch(`${API}/kode-ekonomi`);
      if (!res.ok) throw new Error("Failed to fetch kode ekonomi");
      const ekonomiData = await res.json();
      
      console.log("💰 Kode ekonomi data:", ekonomiData.slice(0, 5)); // Log sample
      
      // Create map: id -> {uraian, level}
      const map = {};
      ekonomiData.forEach((item) => {
        map[item.id] = item; // Store the full item for richer data
      });
      setKodeEkonomiMap(map);
      console.log("🗺️ Kode ekonomi map sample:", Object.entries(map).slice(0, 5));
    } catch (error) {
      console.error("Error fetching kode ekonomi:", error);
    }
  };

  // Fetch data dari API
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch rincian
      const rincianRes = await fetch(`${API}/draft/rincian`);
      if (!rincianRes.ok) throw new Error("Failed to fetch rincian");
      const rincianData = await rincianRes.json();

      // Fetch penjabaran
      const penjabaranRes = await fetch(`${API}/draft/penjabaran`);
      if (!penjabaranRes.ok) throw new Error("Failed to fetch penjabaran");
      const penjabaranDataList = await penjabaranRes.json();

      console.log("📊 Rincian data:", rincianData);
      console.log("📋 Penjabaran data:", penjabaranDataList);

      setData(rincianData);
      setPenjabaranData(penjabaranDataList);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert(`Gagal memuat data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchKodeEkonomi();
    fetchData();
  }, []);

  const buildHierarchy = (kategori) => {
    const allItems = data.filter(item => {
      const ekonomiInfo = kodeEkonomiMap[item.kode_ekonomi_id];
      return ekonomiInfo && ekonomiInfo.uraian.toLowerCase().includes(kategori.toLowerCase());
    });

    const groupedByKode = {};
    allItems.forEach(item => {
      const ekonomiInfo = kodeEkonomiMap[item.kode_ekonomi_id];
      if (ekonomiInfo && ekonomiInfo.full_code) {
        groupedByKode[ekonomiInfo.full_code] = groupedByKode[ekonomiInfo.full_code] || [];
        groupedByKode[ekonomiInfo.full_code].push(item);
      } else {
        console.warn(`Warning: Item ${item.id} has no kode_ekonomi info or full_code:`, ekonomiInfo);
      }
    });

    const sortedKodes = Object.keys(groupedByKode).sort((a, b) => {
      const aParts = a.split('.').map(Number);
      const bParts = b.split('.').map(Number);

      for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i] - bParts[i];
        }
      }
      return aParts.length - bParts.length;
    });

    const hierarchy = {};

    sortedKodes.forEach(kode => {
      const itemsAtKode = groupedByKode[kode];
      if (itemsAtKode) {
        itemsAtKode.forEach(item => {
          const itemWithPenjabaran = { ...item };
          itemWithPenjabaran.penjabaranDetails = (penjabaranData || []).filter(p => String(p.rincian_id) === String(item.id));
          itemWithPenjabaran.penjabaranSum = itemWithPenjabaran.penjabaranDetails.reduce((s, p) => s + sanitizeNumber(p.jumlah_anggaran || 0), 0);
          itemWithPenjabaran.calculatedTotal = Math.max(sanitizeNumber(item.jumlah_anggaran), itemWithPenjabaran.penjabaranSum);

          const ekonomiInfo = kodeEkonomiMap[item.kode_ekonomi_id];
          const fungsiInfo = kodeEkonomiMap[item.kode_fungsi_id];

          // Prioritize uraian from kode_fungsi_id, then kode_ekonomi_id
          itemWithPenjabaran.displayUraian = fungsiInfo?.uraian || ekonomiInfo?.uraian || "Tidak ada uraian";
          itemWithPenjabaran.level = ekonomiInfo?.level || 'unknown'; // Retain level from kode_ekonomi for consistent grouping
          itemWithPenjabaran.kode = ekonomiInfo?.full_code; // Retain kode from kode_ekonomi for consistent grouping

          hierarchy[kode] = itemWithPenjabaran;
        });
      }
    });

    const tree = [];
    Object.keys(hierarchy).forEach(kode => {
      const item = hierarchy[kode];
      const kodeParts = kode.split('.');
      if (kodeParts.length > 1) {
        const parentKode = kodeParts.slice(0, kodeParts.length - 1).join('.');
        if (hierarchy[parentKode]) {
          hierarchy[parentKode].children = hierarchy[parentKode].children || [];
          hierarchy[parentKode].children.push(item);
        } else {
          let existingParent = tree.find(node => node.kode === parentKode);
          if (!existingParent) {
            const parentEkonomiInfo = Object.values(kodeEkonomiMap).find(ke => ke.full_code === parentKode);
            existingParent = {
              kode: parentKode,
              displayUraian: (parentEkonomiInfo && parentEkonomiInfo.uraian) || `Kode ${parentKode}`,
              level: (parentEkonomiInfo && parentEkonomiInfo.level) || 'unknown',
              calculatedTotal: 0,
              children: [],
              isConceptual: true,
            };
            tree.push(existingParent);
          }
          existingParent.children.push(item);
        }
      } else {
        tree.push(item);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => {
        const aKode = a.kode || '';
        const bKode = b.kode || '';

        const aParts = aKode.split('.').map(Number);
        const bParts = bKode.split('.').map(Number);
        
        for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
          if (aParts[i] !== bParts[i]) {
            return aParts[i] - bParts[i];
          }
        }
        return aParts.length - bParts.length;
      });
      nodes.forEach(node => {
        if (node.children) {
          sortTree(node.children);
        }
      });
    };
    sortTree(tree);


    const calculateNodeTotals = (nodes) => {
      let sum = 0;
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          node.calculatedTotal = calculateNodeTotals(node.children);
        }
        sum += node.calculatedTotal;
      });
      return sum;
    };
    const totalSum = calculateNodeTotals(tree);

    return { tree, totalSum };
  };

  const total = (kategori) => {
    const { totalSum } = buildHierarchy(kategori);
    return totalSum;
  };

  const getItems = (kategori) => {
    const { tree } = buildHierarchy(kategori);
    return tree;
  };

  // Simpan hasil posting ke API
  const handlePostingAPB = async () => {
    if (!data || data.length === 0) {
      alert("Belum ada data yang dapat diposting.");
      return;
    }

    try {
      // Get apbdes_id from first rincian (assuming all have same apbdes_id)
      const apbdesId = data[0]?.apbdes_id;
      if (!apbdesId) {
        alert("Tidak dapat menemukan ID APBDes.");
        return;
      }

      const res = await fetch(`${API}/draft/rincian/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: apbdesId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Gagal posting APBDes");
      }

      alert("APBDes berhasil diposting ke Buku APBDes.");
      router.push("/APBDes/buku-apbdes");
    } catch (error) {
      console.error("Error posting APBDes:", error);
      alert(`Gagal posting APBDes: ${error.message}`);
    }
  };

  const renderBox = (title, kategori) => {
    const items = getItems(kategori);

    const renderTree = (nodes, depth = 0) => {
      const paddingLeft = depth * 8; // 8px per level of indentation

      return (
        <div className="divide-y divide-gray-300">
          {nodes.map((node, idx) => (
            <div key={node.id || node.kode || idx}>
              <div
                className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition"
                style={{ paddingLeft: `${paddingLeft}px` }}
              >
                <div className="flex items-center text-sm text-gray-800 space-x-1">
                  <button
                    type="button"
                    onClick={() => node.id && router.push(`/APBDes/input-draft-apbdes?id=${node.id}`)}
                    className="flex items-center space-x-1 text-left"
                    title="Edit item"
                    disabled={!node.id} // Disable edit for conceptual nodes without an actual item ID
                  >
                    <span>{node.displayUraian}</span>
                    {node.id && <span className="text-gray-400 text-xs">✎</span>}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => node.id && router.push(`/APBDes/input-draft-apbdes?id=${node.id}`)}
                  className="text-sm font-light text-black"
                  title="Edit amount"
                  disabled={!node.id} // Disable edit for conceptual nodes
                >
                  Rp{node.calculatedTotal.toLocaleString("id-ID", {
                    minimumFractionDigits: 2,
                  })}
                </button>
              </div>

              {node.penjabaranDetails && node.penjabaranDetails.length > 0 && (
                <div className="ml-8 border-l-2 border-gray-200 pl-4">
                  {node.penjabaranDetails.map((penjabaran, pIdx) => (
                    <div
                      key={penjabaran.id || pIdx}
                      className="flex items-center justify-between py-2 px-2 hover:bg-gray-50 rounded-md transition text-gray-700"
                    >
                      <div className="flex items-center text-sm space-x-2">
                        <span>{penjabaran.objek || penjabaran.jenis || penjabaran.kelompok || "Penjabaran"}</span>
                        <button
                          className="ml-1 text-blue-600 hover:text-blue-800 transition"
                          onClick={() => router.push(`/APBDes/input-draft-penjabaran?id=${penjabaran.id}&rincian_id=${node.id}`)}
                          title="Edit penjabaran"
                        >
                          <Pencil width={16} height={16} />
                        </button>
                      </div>
                      <div className="text-sm font-light">
                        Rp{Number(penjabaran.jumlah_anggaran || 0).toLocaleString("id-ID", {
                          minimumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {node.children && node.children.length > 0 && (
                <div className="pl-4">
                  {renderTree(node.children, depth + 1)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

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

          <button
            className="absolute right-5 text-gray-600 hover:text-gray-900 transition"
            onClick={() => router.push("/APBDes/input-draft-apbdes")}
          >
            <SquarePlus width={20} height={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[180px]">
          {items.length > 0 ? (
            renderTree(items)
          ) : (
            <div className="text-gray-400 text-sm italic px-2 py-3">
              Belum ada data {kategori.toLowerCase()} yang diinput.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-white px-6 md:px-16 py-8">
      <BreadCrumb category="APBDes" title="Draft APBDes" />

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Draft APBDes
          </h1>
          <h3 className="text-sm font-normal text-gray-700 mt-1">
            Anggaran Pendapatan dan Belanja Pemerintah Desa BANGUNTAPAN Tahun
            Anggaran 2025
          </h3>
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-2">
          {/* Tombol Posting */}
          <Button
            variant="solid"
            className="bg-[#0779ce] hover:bg-[#066bb8] text-white flex items-center justify-between px-4 py-2 rounded-lg w-48 shadow-sm"
            onClick={handlePostingAPB}
            disabled={loading}
          >
            <span>Posting APB</span>
            <ArrowUpRight width={18} height={18} />
          </Button>

          {/* Tombol Unduh (masih nonaktif) */}
          <Button
            variant="solid"
            className="bg-[#ff9500] hover:bg-[#e68600] text-white flex items-center justify-between px-4 py-2 rounded-lg w-48 shadow-sm"
            onClick={() => alert("Fitur Unduh File belum diaktifkan")}
          >
            <span>Unduh File</span>
            <Download width={18} height={18} />
          </Button>

          {/* Tombol Input */}
          <Button
            variant="solid"
            className="bg-[#069250] hover:bg-[#058544] text-white flex items-center justify-between px-4 py-2 rounded-lg w-48 shadow-sm"
            onClick={() => router.push("/APBDes/input-draft-apbdes")}
          >
            <span>Input Data</span>
            <Plus width={18} height={18} />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Memuat data...</p>
        </div>
      ) : (
        /* Box Section */
        <div className="space-y-8">
          {renderBox("Pendapatan", "Pendapatan")}
          {renderBox("Belanja", "Belanja")}
          {renderBox("Pembiayaan", "Pembiayaan")}
        </div>
      )}
    </main>
  );
}
