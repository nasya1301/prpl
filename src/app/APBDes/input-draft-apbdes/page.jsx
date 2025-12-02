"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/breadCrumb";
import Button from "@/components/button";
import FormDropdown from "@/components/formDropdown";
import { TextInput } from "@/components/formInput";
import { Trash, Floppy, ToggleLeft, ToggleRight } from "@/components/icons";

export default function InputDraftAPBDes() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // Get id from query if editing
  const sumberDanaOptions = ["PBH", "DDS", "ADD", "DLL", "PBP"];
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  // States to hold the currently displayed options for dropdowns
  const [akunOptions, setAkunOptions] = useState([]);
  const [kelompokOptions, setKelompokOptions] = useState([]);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [subBidangOptions, setSubBidangOptions] = useState([]);
  const [kegiatanOptions, setKegiatanOptions] = useState([]);

  // States to hold the FULL list of options fetched initially
  const [allAkunOptions, setAllAkunOptions] = useState([]);
  const [allKelompokOptions, setAllKelompokOptions] = useState([]);
  const [allBidangOptions, setAllBidangOptions] = useState([]);
  const [allSubBidangOptions, setAllSubBidangOptions] = useState([]);
  const [allKegiatanOptions, setAllKegiatanOptions] = useState([]);

  const [bidangData, setBidangData] = useState([]); // To store full bidang objects
  const [subBidangData, setSubBidangData] = useState([]); // To store full subBidang objects
  const [kegiatanData, setKegiatanData] = useState([]); // To store full kegiatan objects
  const [akunData, setAkunData] = useState([]);
  const [kelompokData, setKelompokData] = useState([]);

  const [selectedBidangId, setSelectedBidangId] = useState(null);
  const [selectedSubBidangId, setSelectedSubBidangId] = useState(null);
  const [selectedAkunId, setSelectedAkunId] = useState(null);
  const [selectedKelompokId, setSelectedKelompokId] = useState(null);

  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [kodeEkoError, setKodeEkoError] = useState("");
  const [kodeRekError, setKodeRekError] = useState("");

  const [formData, setFormData] = useState({
    id: Date.now(),
    kodeRekEkonomi: "",
    pendapatanBelanja: "",
    kodeRekBidang: "",
    bidang: "",
    subBidang: "",
    kegiatan: "",
    anggaran: "",
    kelompok: "",
  });

  // ====== PARSING & FORMATTING UTILITIES (dari Kas-umum form) ======
  
  // Parse "4.1.1.01" atau "4.1.1.90-99" → ["4","1","1","01"] atau ["4","1","1","90-99"]
  const ekoParse = (s) =>
    (s || "")
      .toString()
      .replace(/\./g, " ")
      .replace(/[^\d \-]+/g, "") // Allow dash for ranges like 90-99
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  // Format ke "A B C DD" (Objek/token ke-4 dipad 2 digit atau range seperti 90-99)
  const ekoFormat = (parts) => {
    const [a = "", b = "", c = "", d = ""] = parts;
    const out = [];
    if (a) out.push(String(parseInt(a, 10)));
    if (b) out.push(String(parseInt(b, 10)));
    if (c) out.push(String(parseInt(c, 10)));
    if (d) {
      // Handle ranges like '90-99' or regular numbers
      if (d.includes('-')) {
        out.push(d); // Keep range as-is
      } else {
        out.push(String(d).padStart(2, "0")); // Pad single numbers
      }
    }
    return out.join(" ");
  };

  // Validator sederhana untuk A B C DD (termasuk range seperti 90-99)
  const validateKodeEko = (kode) => {
    if (!kode) return "";
    const clean = kode.replace(/\./g, " ").trim();
    // Allow ranges like '90-99' in the DD position
    const pattern = /^\d+(\s+\d+(\s+\d+(\s+(\d{1,2}|\d{1,2}-\d{1,2}))?)?)?$/; // A [B [C [DD or DD-DD]]]
    if (!pattern.test(clean)) return "Format harus 'A B C DD' (contoh: 4 1 1 01 atau 4 1 1 90-99)";
    const p = clean.split(/\s+/);
    if (p[0] && p[0].length > 1) return "Akun (A) 1 digit";
    if (p[1] && p[1].length > 1) return "Kelompok (B) 1 digit";
    if (p[2] && p[2].length > 1) return "Jenis (C) 1 digit";
    if (p[3]) {
      // Validate DD: either 1-2 digits or a range like DD-DD
      if (p[3].includes('-')) {
        const rangeParts = p[3].split('-');
        if (rangeParts.length !== 2 || 
            rangeParts[0].length > 2 || rangeParts[1].length > 2 ||
            !/^\d+$/.test(rangeParts[0]) || !/^\d+$/.test(rangeParts[1])) {
          return "Objek (DD) harus 1-2 digit atau range (contoh: 90-99)";
        }
      } else if (p[3].length > 2) {
        return "Objek (DD) maksimal 2 digit";
      }
    }
    return "";
  };

  // Format dari full_code API (bisa bertitik) → spasi
  const formatEkoFromFullCode = (full) => ekoFormat(ekoParse(full));

  // Fungsi validasi format kode bidang (x x xx)
  // Validator untuk x x xx (termasuk range seperti 1 1 90-99)
  const validateKodeRek = (kode) => {
    if (!kode) return "";
    const cleanKode = kode.replace(/\./g, " ").trim();
    // Allow ranges like '90-99' in the xx position
    const pattern = /^\d+(\s+\d+(\s+(\d{1,2}|\d{1,2}-\d{1,2}))?)?$/; // x [x [xx or xx-xx]]
    if (!pattern.test(cleanKode)) {
      return "Format kode harus 'x x xx' (contoh: 1 2 03 atau 1 1 90-99)";
    }
    const parts = cleanKode.split(/\s+/);
    if (parts[0] && parts[0].length > 1) return "Kode bidang harus 1 digit";
    if (parts[1] && parts[1].length > 1) return "Kode sub-bidang harus 1 digit";
    if (parts[2]) {
      // Validate xx: either 1-2 digits or a range like xx-xx
      if (parts[2].includes('-')) {
        const rangeParts = parts[2].split('-');
        if (rangeParts.length !== 2 || 
            rangeParts[0].length > 2 || rangeParts[1].length > 2 ||
            !/^\d+$/.test(rangeParts[0]) || !/^\d+$/.test(rangeParts[1])) {
          return "Kode kegiatan harus 1-2 digit atau range (contoh: 90-99)";
        }
      } else if (parts[2].length > 2) {
        return "Kode kegiatan maksimal 2 digit";
      }
    }
    return "";
  };

  // Format kode bidang ke format yang benar (x x xx atau x x xx-xx)
  const formatKodeRek = (kode) => {
    const cleanKode = kode.replace(/\./g, " ");
    const parts = cleanKode.split(/\s+/);
    const formattedParts = parts.map((part, index) => {
      if (index === 2) {
        // Handle ranges like '90-99' or regular numbers
        if (part.includes('-')) {
          return part; // Keep range as-is
        }
        return part.padStart(2, "0");
      }
      return parseInt(part);
    });
    return formattedParts.join(" ");
  };

  // Removed debounce - using direct parsing logic instead

  // Fetch all dropdown options on component mount
  useEffect(() => {
    async function fetchAllDropdownOptions() {
      try {
        const response = await fetch(`${API}/all-dropdown-options`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { data } = await response.json();

        // Set initial full lists
        setAllAkunOptions(data.akun.map((item) => item.uraian));
        setAllKelompokOptions(data.kelompok.map((item) => item.uraian));
        setAllBidangOptions(data.bidang.map((item) => item.uraian));
        setAllSubBidangOptions(data.subBidang.map((item) => item.uraian));
        setAllKegiatanOptions(data.kegiatan.map((item) => item.uraian));

        // Also set the current options to the full lists initially
        setAkunOptions(data.akun.map((item) => item.uraian));
        setKelompokOptions(data.kelompok.map((item) => item.uraian));
        setBidangOptions(data.bidang.map((item) => item.uraian));
        setSubBidangOptions(data.subBidang.map((item) => item.uraian));
        setKegiatanOptions(data.kegiatan.map((item) => item.uraian));

        setBidangData(data.bidang);
        setSubBidangData(data.subBidang);
        setKegiatanData(data.kegiatan);
        setAkunData(data.akun);
        setKelompokData(data.kelompok);
      } catch (error) {
        console.error("Failed to fetch all dropdown options:", error);
      }
    }
    fetchAllDropdownOptions();
  }, []);

  // Filter Sub-Bidang options when a Bidang is selected
  useEffect(() => {
    if (selectedBidangId && subBidangData.length > 0) {
      const filtered = subBidangData.filter((item) => item.parent_id === selectedBidangId);
      setSubBidangOptions(filtered.map((item) => item.uraian));
    } else {
      setSubBidangOptions(allSubBidangOptions); // Reset if no Bidang is selected
    }
    if (!isLoadingEditData) {
      handleOnChange("subBidang", ""); // Reset sub-bidang selection
      handleOnChange("kegiatan", ""); // Reset kegiatan selection
    }
  }, [selectedBidangId, subBidangData, allSubBidangOptions]);

  // Filter Kegiatan options when a Sub-Bidang is selected
  useEffect(() => {
    if (selectedSubBidangId && kegiatanData.length > 0) {
      const filtered = kegiatanData.filter((item) => item.parent_id === selectedSubBidangId);
      setKegiatanOptions(filtered.map((item) => item.uraian));
    } else {
      setKegiatanOptions(allKegiatanOptions); // Reset if no Sub-Bidang is selected
    }
    if (!isLoadingEditData) {
      handleOnChange("kegiatan", ""); // Reset kegiatan selection
    }
  }, [selectedSubBidangId, kegiatanData, allKegiatanOptions]);

  // Filter Sumber Dana options when an Akun is selected
  useEffect(() => {
    if (selectedAkunId && kelompokData.length > 0) {
      const filtered = kelompokData.filter((item) => item.parent_id === selectedAkunId);
      setKelompokOptions(filtered.map((item) => item.uraian));
    } else {
      setKelompokOptions(allKelompokOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("kelompok", "");
    }
  }, [selectedAkunId, kelompokData, allKelompokOptions]);

  // Helpers: sanitize number and normalize kategori
  const sanitizeNumber = (val) => {
    if (val === null || val === undefined) return 0;
    const s = String(val).replace(/\s/g, "").replace(/[^0-9.,-]/g, "");
    // If contains both '.' and ',' assume '.' thousands and ',' decimal
    if (s.indexOf(",") > -1 && s.indexOf(".") > -1) {
      return Number(s.replace(/\./g, "").replace(",", ".")) || 0;
    }
    // If contains only '.' and multiple dots, remove them (thousands separators)
    if (s.indexOf(".") > -1 && s.indexOf(",") === -1) {
      if ((s.match(/\./g) || []).length > 1) {
        return Number(s.replace(/\./g, "")) || 0;
      }
      return Number(s) || 0;
    }
    if (s.indexOf(",") > -1) return Number(s.replace(",", ".")) || 0;
    return Number(s) || 0;
  };

  // Helper to format anggaran input with dots for thousands
  const formatAnggaranInput = (value) => {
    if (value === null || value === undefined || value === "") return "";
    // Remove all non-digit characters
    let cleanedValue = String(value).replace(/[^0-9]/g, "");

    // Add thousands separator
    return cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const normalizeKategori = (label) => {
    if (!label) return "";
    const v = label.toString().toLowerCase();
    if (v.includes("pendapatan")) return "Pendapatan";
    if (v.includes("belanja")) return "Belanja";
    if (v.includes("pembiayaan")) return "Pembiayaan";
    return label;
  };

  const [buatLagi, setBuatLagi] = useState(false);

  // Load data kalau sedang edit
  useEffect(() => {
    // Only require the basic dropdown data to be loaded, not all of them
    if (id && akunData.length > 0 && kelompokData.length > 0 && 
        bidangData.length > 0 && subBidangData.length > 0 && kegiatanData.length > 0) {
      
      // Fetch data dari API
      const fetchEditData = async () => {
        try {
          setIsLoadingEditData(true);
          
          const res = await fetch(`${API}/draft/rincian/${id}`);
          if (!res.ok) throw new Error("Failed to fetch data");
          
          const result = await res.json();
          const existing = result.data || result;
          
          console.log("📝 Loading edit data:", existing);
          
          if (existing) {
            console.log("Debug: existing.jumlah_anggaran =", existing.jumlah_anggaran);

            // Map kode_ekonomi_id ke format form
            const ekonomiInfo = kelompokData.find(k => k.id === existing.kode_ekonomi_id) 
              || akunData.find(a => a.id === existing.kode_ekonomi_id);
            
            // Map kode_fungsi_id ke format form  
            const fungsiInfo = bidangData.find(b => b.id === existing.kode_fungsi_id)
              || subBidangData.find(s => s.id === existing.kode_fungsi_id)
              || kegiatanData.find(k => k.id === existing.kode_fungsi_id);
            
            // Convert ID ke full_code untuk display
            const kodeRekEkonomi = ekonomiInfo?.full_code || "";
            const kodeRekBidang = fungsiInfo?.full_code || "";
            
            // Find all hierarchy items
            let akunItem = null, kelompokItem = null, bidangItem = null, subBidangItem = null, kegiatanItem = null;
            
            if (existing.kode_ekonomi_id) {
              // First, try to find the exact item
              const exactEkonomiItem = akunData.find(a => a.id === existing.kode_ekonomi_id)
                || kelompokData.find(k => k.id === existing.kode_ekonomi_id);
              
              console.log("🔍 Exact ekonomi item:", exactEkonomiItem);
              
              if (exactEkonomiItem) {
                // Determine level by checking if it has parent_id
                // If no parent_id or parent_id is null, it's akun level
                // If it has parent_id, it's kelompok level
                if (!exactEkonomiItem.parent_id || exactEkonomiItem.parent_id === null) {
                  // The item itself is akun (top level)
                  akunItem = exactEkonomiItem;
                  console.log("✅ Found akun (top level):", akunItem);
                } else {
                  // The item is kelompok (has parent)
                  kelompokItem = exactEkonomiItem;
                  console.log("✅ Found kelompok:", kelompokItem);
                  console.log("🔍 Looking for parent with ID:", exactEkonomiItem.parent_id);
                  
                  // Find the akun parent
                  akunItem = akunData.find(a => 
                    String(a.id) === String(exactEkonomiItem.parent_id)
                  );
                  
                  console.log("✅ Found akun parent:", akunItem);
                }
              } else {
                console.log("❌ Exact ekonomi item not found for ID:", existing.kode_ekonomi_id);
              }
            }
            
            if (existing.kode_fungsi_id) {
              // First, try to find the exact item
              const exactFungsiItem = bidangData.find(b => b.id === existing.kode_fungsi_id)
                || subBidangData.find(s => s.id === existing.kode_fungsi_id)
                || kegiatanData.find(k => k.id === existing.kode_fungsi_id);
              
              console.log("🔍 Exact fungsi item:", exactFungsiItem);
              
              if (exactFungsiItem) {
                // Determine hierarchy by checking parent_id chain
                const isInBidang = bidangData.some(b => b.id === exactFungsiItem.id);
                const isInSubBidang = subBidangData.some(s => s.id === exactFungsiItem.id);
                const isInKegiatan = kegiatanData.some(k => k.id === exactFungsiItem.id);
                
                if (isInBidang && !exactFungsiItem.parent_id) {
                  // Top level bidang
                  bidangItem = exactFungsiItem;
                } else if (isInSubBidang) {
                  // Sub-bidang level
                  subBidangItem = exactFungsiItem;
                  bidangItem = bidangData.find(b => String(b.id) === String(exactFungsiItem.parent_id));
                } else if (isInKegiatan) {
                  // Kegiatan level
                  kegiatanItem = exactFungsiItem;
                  // Find sub-bidang parent
                  const subBidang = subBidangData.find(s => String(s.id) === String(exactFungsiItem.parent_id));
                  if (subBidang) {
                    subBidangItem = subBidang;
                    bidangItem = bidangData.find(b => String(b.id) === String(subBidang.parent_id));
                  }
                }
              }
            }
            
            console.log("📊 Found items:", { akunItem, kelompokItem, bidangItem, subBidangItem, kegiatanItem });
            
            // Set all IDs first (this triggers filtering in useEffects)
            if (akunItem) setSelectedAkunId(akunItem.id);
            if (kelompokItem) setSelectedKelompokId(kelompokItem.id);
            if (bidangItem) setSelectedBidangId(bidangItem.id);
            if (subBidangItem) setSelectedSubBidangId(subBidangItem.id);
            
            // Set form data with all values
            // For anggaran: only set if value exists and > 0, otherwise leave empty
            const anggaranValue = existing.jumlah_anggaran && existing.jumlah_anggaran > 0 
              ? String(Math.floor(existing.jumlah_anggaran)) // Ensure it's an integer without decimals
              : "";
            
            console.log("💰 Setting anggaran from DB:", existing.jumlah_anggaran, "→ formData:", anggaranValue);
            
            setFormData({
              id: existing.id,
              kodeRekEkonomi: kodeRekEkonomi,
              pendapatanBelanja: akunItem?.uraian || "",
              kelompok: kelompokItem?.uraian || "",
              kodeRekBidang: kodeRekBidang,
              bidang: bidangItem?.uraian || "",
              subBidang: subBidangItem?.uraian || "",
              kegiatan: kegiatanItem?.uraian || "",
              anggaran: anggaranValue,
              sumberDana: existing.sumber_dana || "",
            });
            
            // Give time for filtering to complete, then disable loading flag
            setTimeout(() => {
              setIsLoadingEditData(false);
            }, 100);
          }
        } catch (error) {
          console.error("Error loading edit data:", error);
          alert(`Gagal memuat data: ${error.message}`);
          setIsLoadingEditData(false);
        }
      };
      
      fetchEditData();
    }
  }, [id, akunData, bidangData, subBidangData, kelompokData, kegiatanData]);

  const handleOnChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle Kode Rek Ekonomi change dengan parsing logic (dari Kas-umum form)
  const handleKodeRekEkonomiChange = (value) => {
    if (value === formData.kodeRekEkonomi) return;
    
    const err = validateKodeEko(value);
    setKodeEkoError(err);
    handleOnChange("kodeRekEkonomi", value);

    if (!err) {
      const parts = ekoParse(value); // ["A","B","C","DD"]

      // 1) AKUN = token[0]
      if (parts[0] && akunData.length > 0) {
        const mAkun = akunData.find((a) => ekoParse(a.full_code)[0] === parts[0]);
        if (mAkun) {
          handleOnChange("pendapatanBelanja", mAkun.uraian);
          setSelectedAkunId(mAkun.id);
          // reset turunannya
          handleOnChange("kelompok", "");
        }
      }

      // 2) KELOMPOK = token[0..1]
      if (parts.length >= 2 && kelompokData.length > 0) {
        const mKelompok = kelompokData.find((k) => {
          const tok = ekoParse(k.full_code);
          return tok[0] === parts[0] && tok[1] === parts[1];
        });
        if (mKelompok) {
          handleOnChange("kelompok", mKelompok.uraian);
          setSelectedKelompokId(mKelompok.id);
        }
      }

      // Jika kosong total → kosongkan dropdown
      if (parts.length === 0) {
        handleOnChange("pendapatanBelanja", "");
        handleOnChange("kelompok", "");
      }
    }
  };

  // Handle Kode Rek Bidang change dengan parsing logic (dari Kas-umum form)
  const handleKodeRekBidangChange = (value) => {
    // Hanya proses jika ada perubahan
    if (value === formData.kodeRekBidang) return;
    
    const error = validateKodeRek(value);
    setKodeRekError(error);
    // Update form dengan kode yang diinput
    handleOnChange("kodeRekBidang", value);
    
    if (!error) {
      // Format: ubah titik jadi spasi dan trim
      const cleanKode = value.replace(/\./g, " ").trim();
      const parts = cleanKode.split(/\s+/).filter(Boolean);
      
      // Jika kosong total → kosongkan semua dropdown dan selected IDs
      if (parts.length === 0 || !value.trim()) {
        handleOnChange("bidang", "");
        handleOnChange("subBidang", "");
        handleOnChange("kegiatan", "");
        setSelectedBidangId(null);
        setSelectedSubBidangId(null);
        return;
      }
      
      if (parts[0]) {
        const matchingBidang = bidangData.find((b) => {
          const bidangParts = b.full_code.replace(/\./g, " ").trim().split(/\s+/);
          return parseInt(bidangParts[0]) === parseInt(parts[0]);
        });
        
        if (matchingBidang) {
          handleOnChange("bidang", matchingBidang.uraian);
          setSelectedBidangId(matchingBidang.id);
          handleOnChange("subBidang", "");
          handleOnChange("kegiatan", "");
          
          if (parts[1] && subBidangData.length > 0) {
            const matchingSubBidang = subBidangData.find((s) => {
              const subParts = s.full_code.replace(/\./g, " ").trim().split(/\s+/);
              return (
                parseInt(subParts[0]) === parseInt(parts[0]) &&
                parseInt(subParts[1]) === parseInt(parts[1])
              );
            });
            
            if (matchingSubBidang) {
              handleOnChange("subBidang", matchingSubBidang.uraian);
              setSelectedSubBidangId(matchingSubBidang.id);
              handleOnChange("kegiatan", "");
              
              if (parts[2] && kegiatanData.length > 0) {
                const matchingKegiatan = kegiatanData.find((k) => {
                  // Handle both regular numbers and ranges
                  const kegiatanCode = parts[2].includes('-') ? parts[2] : parts[2].padStart(2, "0");
                  const targetKode = `${parseInt(parts[0])} ${parseInt(parts[1])} ${kegiatanCode}`;
                  return k.full_code.replace(/\./g, " ").trim() === targetKode;
                });
                
                if (matchingKegiatan) {
                  handleOnChange("kegiatan", matchingKegiatan.uraian);
                }
              }
            }
          }
        }
      }
    }
  };

  const handleSimpan = async () => {
    try {
      let kegiatanIdToSend = null;
      if (formData.kegiatan) {
        const selectedKegiatan = kegiatanData.find(k => k.uraian === formData.kegiatan);
        if (selectedKegiatan) {
          kegiatanIdToSend = selectedKegiatan.id;
        } else {
          // Handle case where kegiatan is selected but not found (e.g., partial input, data mismatch)
          throw new Error("Kegiatan yang dipilih tidak valid.");
        }
      }

      const payload = {
        kegiatan_id: kegiatanIdToSend,
        kode_fungsi_id: formData.kodeRekBidang,
        kode_ekonomi_id: formData.kodeRekEkonomi,
        jumlah_anggaran: sanitizeNumber(formData.anggaran),
        sumber_dana: formData.sumberDana,
      };

      console.log("📤 Sending payload:", payload);

      // Determine if this is an edit (id from query param) or a new entry
      const isEditing = !!id;
      const url = isEditing 
        ? `${API}/draft/rincian/${id}` 
        : `${API}/draft/rincian`;
      const method = isEditing ? "PUT" : "POST";

      console.log(`🔧 ${method} to ${url}`);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Log status dan response mentah
      console.log("🛰️ Status:", res.status);
      const text = await res.text();
      console.log("📩 Raw response:", text);

      // Coba parse JSON kalau bisa
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Respon bukan JSON: ${text.slice(0, 100)}...`);
      }

      if (!res.ok) {
        console.error("❌ Backend error:", data);
        // Display the hint if available for better user feedback
        const errorMsg = data.hint || data.error || "Terjadi kesalahan";
        throw new Error(errorMsg);
      }

      console.log("✅ Success:", data);
      alert(data.message || "Data berhasil disimpan!");

      // If user selected "Buat lagi", reset form for new entry
      if (!buatLagi) {
        router.push("/APBDes/output-draft-apbdes");
      } else {
        setFormData({
          id: Date.now(),
          kodeRekEkonomi: "",
          pendapatanBelanja: "",
          kelompok: "",
          kodeRekBidang: "",
          bidang: "",
          subBidang: "",
          kegiatan: "",
          anggaran: "",
          sumberDana: "",
        });
        // Reset selected IDs
        setSelectedBidangId(null);
        setSelectedSubBidangId(null);
        setSelectedAkunId(null);
        setSelectedKelompokId(null);
      }
    } catch (error) {
      console.error("🚨 Caught error:", error);
      alert(`Terjadi kesalahan: ${error.message || JSON.stringify(error)}`);
    }
  };

  // 🗑️ Hapus data + konfirmasi (seperti di kode kedua)
  const handleHapus = async () => {
    if (!id) {
      // If no ID from query param, just reset the form
      setFormData({
        id: Date.now(),
        kodeRekEkonomi: "",
        pendapatanBelanja: "",
        kelompok: "",
        kodeRekBidang: "",
        bidang: "",
        subBidang: "",
        kegiatan: "",
        anggaran: "",
        sumberDana: "",
      });
      setSelectedBidangId(null);
      setSelectedSubBidangId(null);
      setSelectedAkunId(null);
      setSelectedKelompokId(null);
      return;
    }

    const confirmDelete = window.confirm(
      "⚠️ Apakah Anda yakin ingin menghapus data ini?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/draft/rincian/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Gagal menghapus data");
      }

      alert("🗑️ Data berhasil dihapus!");
      router.push("/APBDes/output-draft-apbdes");
    } catch (error) {
      console.error("Error deleting:", error);
      alert(`Gagal menghapus data: ${error.message}`);
    }
  };

  return (
    <main className="min-h-screen bg-white px-16 py-8">
      <BreadCrumb category="APBDes" title="Input Draft APBDes" />

      <h1 className="mb-6 text-base font-semibold text-black">
        {id ? "Edit Data APBDes" : "Input Data APBDes"}
      </h1>

      {/* ===== KODE REKENING DAN URAIAN ===== */}
      <div className="mb-6 rounded-2xl border border-gray-400 px-6 py-6 overflow-x-auto">
        <h2 className="text-sm font-semibold text-[#011829] mb-4">
          Kode Rekening dan Uraian
        </h2>

        {/* Klasifikasi Ekonomi */}
        <div className="space-y-2 min-w-[900px]">
          <label className="block text-sm font-medium text-[#011829]">
            Klasifikasi Ekonomi
          </label>
          <div className="flex gap-3 w-full">
            <div className="w-[15%] min-w-[120px]">
              <TextInput
                placeholder="Kode Rek"
                value={formData.kodeRekEkonomi}
                onChange={handleKodeRekEkonomiChange}
              />
            </div>
            <div className="w-[42.5%] min-w-[200px]">
              <FormDropdown
                label="Pendapatan / Belanja / Pembiayaan"
                options={akunOptions}
                value={formData.pendapatanBelanja}
                onChange={(val) => {
                  if (!val) {
                    handleOnChange("pendapatanBelanja", "");
                    handleOnChange("kelompok", "");
                    handleOnChange("kodeRekEkonomi", "");
                    setKodeEkoError("");
                    return;
                  }
                  const a = akunData.find((x) => x.uraian === val);
                  if (a) {
                    const kodeAkun = ekoFormat(ekoParse(a.full_code).slice(0, 1));
                    handleOnChange("pendapatanBelanja", val);
                    handleOnChange("kelompok", "");
                    handleOnChange("kodeRekEkonomi", kodeAkun);
                    setSelectedAkunId(a.id);
                    setKodeEkoError("");
                  }
                }}
              />
            </div>
            <div className="w-[42.5%] min-w-[200px]">
              <FormDropdown
                label="Kelompok"
                options={kelompokOptions}
                value={formData.kelompok}
                onChange={(val) => {
                  if (!val) {
                    if (formData.pendapatanBelanja) {
                      const a = akunData.find((x) => x.uraian === formData.pendapatanBelanja);
                      const kodeAkun = a ? ekoFormat(ekoParse(a.full_code).slice(0, 1)) : "";
                      handleOnChange("kelompok", "");
                      handleOnChange("kodeRekEkonomi", kodeAkun);
                    } else {
                      handleOnChange("kelompok", "");
                      handleOnChange("kodeRekEkonomi", "");
                    }
                    setKodeEkoError("");
                    return;
                  }
                  const k = kelompokData.find((x) => x.uraian === val);
                  if (k) {
                    const kodeKelompok = ekoFormat(ekoParse(k.full_code).slice(0, 2));
                    handleOnChange("kelompok", val);
                    handleOnChange("kodeRekEkonomi", kodeKelompok);
                    setSelectedKelompokId(k.id);
                    setKodeEkoError("");
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Klasifikasi Bidang Kegiatan */}
        <div className="space-y-2 min-w-[900px] mt-5">
          <label className="block text-sm font-medium text-[#011829]">
            Klasifikasi Bidang Kegiatan
          </label>
          <div className="flex gap-3 w-full">
            <div className="w-[15%] min-w-[120px]">
              <TextInput
                placeholder="Kode Rek"
                value={formData.kodeRekBidang}
                onChange={handleKodeRekBidangChange}
              />
            </div>
            <div className="w-[28.3%] min-w-[180px]">
              <FormDropdown
                label="Bidang"
                options={bidangOptions}
                value={formData.bidang}
                onChange={(val) => {
                  if (!val) {
                    handleOnChange("bidang", "");
                    handleOnChange("subBidang", "");
                    handleOnChange("kegiatan", "");
                    handleOnChange("kodeRekBidang", "");
                    setKodeRekError("");
                    return;
                  }
                  const selectedBidang = bidangData.find((b) => b.uraian === val);
                  if (selectedBidang) {
                    const parts = selectedBidang.full_code.replace(/\./g, " ").trim().split(/\s+/);
                    const formattedCode = `${parseInt(parts[0])}`;
                    handleOnChange("bidang", val);
                    handleOnChange("subBidang", "");
                    handleOnChange("kegiatan", "");
                    handleOnChange("kodeRekBidang", formattedCode);
                    setSelectedBidangId(selectedBidang.id);
                    setKodeRekError("");
                  }
                }}
              />
            </div>
            <div className="w-[28.3%] min-w-[180px]">
              <FormDropdown
                label="Sub-Bidang"
                options={subBidangOptions}
                value={formData.subBidang}
                onChange={(val) => {
                  if (!val) {
                    if (formData.bidang) {
                      const selectedBidang = bidangData.find((b) => b.uraian === formData.bidang);
                      if (selectedBidang) {
                        const parts = selectedBidang.full_code.replace(/\./g, " ").trim().split(/\s+/);
                        const formattedCode = `${parseInt(parts[0])}`;
                        handleOnChange("subBidang", "");
                        handleOnChange("kegiatan", "");
                        handleOnChange("kodeRekBidang", formattedCode);
                      }
                    } else {
                      handleOnChange("subBidang", "");
                      handleOnChange("kegiatan", "");
                      handleOnChange("kodeRekBidang", "");
                    }
                    setKodeRekError("");
                    return;
                  }
                  const selectedSubBidang = subBidangData.find((s) => s.uraian === val);
                  if (selectedSubBidang) {
                    const parts = selectedSubBidang.full_code.replace(/\./g, " ").trim().split(/\s+/);
                    const formattedCode = `${parseInt(parts[0])} ${parseInt(parts[1])}`;
                    handleOnChange("subBidang", val);
                    handleOnChange("kegiatan", "");
                    handleOnChange("kodeRekBidang", formattedCode);
                    const selected = subBidangData.find(
                      (item) => item.uraian === val && item.parent_id === selectedBidangId
                    );
                    setSelectedSubBidangId(selected ? selected.id : null);
                    setKodeRekError("");
                  }
                }}
              />
            </div>
            <div className="w-[28.3%] min-w-[180px]">
              <FormDropdown
                label="Kegiatan"
                options={kegiatanOptions}
                value={formData.kegiatan}
                onChange={(val) => {
                  if (!val) {
                    if (formData.subBidang) {
                      const selectedSubBidang = subBidangData.find((s) => s.uraian === formData.subBidang);
                      if (selectedSubBidang) {
                        const parts = selectedSubBidang.full_code.replace(/\./g, " ").trim().split(/\s+/);
                        const formattedCode = `${parseInt(parts[0])} ${parseInt(parts[1])}`;
                        handleOnChange("kegiatan", "");
                        handleOnChange("kodeRekBidang", formattedCode);
                      }
                    } else {
                      handleOnChange("kegiatan", "");
                      handleOnChange("kodeRekBidang", "");
                    }
                    setKodeRekError("");
                    return;
                  }
                  const selectedKegiatan = kegiatanData.find((k) => k.uraian === val);
                  if (selectedKegiatan) {
                    const parts = selectedKegiatan.full_code.replace(/\./g, " ").trim().split(/\s+/);
                    // Handle ranges like '90-99' or regular numbers
                    const kegiatanCode = parts[2].includes('-') ? parts[2] : parts[2].padStart(2, "0");
                    const formattedCode = `${parseInt(parts[0])} ${parseInt(parts[1])} ${kegiatanCode}`;
                    handleOnChange("kegiatan", val);
                    handleOnChange("kodeRekBidang", formattedCode);
                    setKodeRekError("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== ANGGARAN DAN SUMBER DANA ===== */}
      <div className="mb-8 space-y-5 rounded-2xl border border-gray-400 px-6 py-6">
        <h2 className="text-sm font-semibold text-[#011829]">
          Anggaran dan Sumber Dana
        </h2>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#011829]">
            Anggaran
          </label>
          <TextInput
            prefix="Rp"
            placeholder="0.000.000"
            value={formatAnggaranInput(formData.anggaran)}
            onChange={(val) => handleOnChange("anggaran", String(val).replace(/[^0-9]/g, ""))}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#011829]">
            Sumber Dana
          </label>
          <FormDropdown
            label="PBH / DDS / ADD / DLL / PBP"
            options={sumberDanaOptions}
            value={formData.sumberDana}
            onChange={(val) => {
              handleOnChange("sumberDana", val);
            }}
          />
        </div>
      </div>

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-between">
        <Button variant="danger" onClick={handleHapus}>
          Hapus
          <Trash width={16} height={16} />
        </Button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setBuatLagi((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <span className="text-sm text-gray-700">Buat lagi</span>
            {buatLagi ? (
              <ToggleRight
                width={28}
                height={28}
                className="text-blue-600 transition-colors duration-200"
              />
            ) : (
              <ToggleLeft
                width={28}
                height={28}
                className="text-gray-500 transition-colors duration-200"
              />
            )}
          </button>

          <Button variant="primary" onClick={handleSimpan}>
            Simpan
            <Floppy width={16} height={16} />
          </Button>
        </div>
      </div>
    </main>
  );
}
