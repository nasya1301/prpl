"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BreadCrumb from "@/components/breadCrumb";
import Button from "@/components/button";
import FormDropdown from "@/components/formDropdown";
import { TextInput } from "@/components/formInput";
import { Trash, Floppy, ToggleLeft, ToggleRight } from "@/components/icons";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function InputDraftPenjabaran() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id"); // id of this penjabaran when editing
  const rincian_id = searchParams.get("rincian_id"); // parent rincian (APBDes) when creating penjabaran
  const [parentItem, setParentItem] = useState(null);
  const sumberDanaOptions = ["PBH", "DDS", "ADD", "DLL", "PBP"];

  // dropdown display options
  const [akunOptions, setAkunOptions] = useState([]);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [objekOptions, setObjekOptions] = useState([]);
  const [kelompokOptions, setKelompokOptions] = useState([]);
  const [bidangOptions, setBidangOptions] = useState([]);
  const [subBidangOptions, setSubBidangOptions] = useState([]);
  const [kegiatanOptions, setKegiatanOptions] = useState([]);

  // full lists (raw objects)
  const [allAkunOptions, setAllAkunOptions] = useState([]);
  const [allJenisOptions, setAllJenisOptions] = useState([]);
  const [allObjekOptions, setAllObjekOptions] = useState([]);
  const [allKelompokOptions, setAllKelompokOptions] = useState([]);
  const [allBidangOptions, setAllBidangOptions] = useState([]);
  const [allSubBidangOptions, setAllSubBidangOptions] = useState([]);
  const [allKegiatanOptions, setAllKegiatanOptions] = useState([]);

  const [bidangData, setBidangData] = useState([]);
  const [subBidangData, setSubBidangData] = useState([]);
  const [kegiatanData, setKegiatanData] = useState([]);
  const [akunData, setAkunData] = useState([]);
  const [kelompokData, setKelompokData] = useState([]);
  const [jenisData, setJenisData] = useState([]);
  const [objekData, setObjekData] = useState([]);

  // selected ids (used to build payload and filter child dropdowns)
  const [selectedBidangId, setSelectedBidangId] = useState(null);
  const [selectedSubBidangId, setSelectedSubBidangId] = useState(null);
  const [selectedAkunId, setSelectedAkunId] = useState(null);
  const [selectedKelompokId, setSelectedKelompokId] = useState(null);
  const [selectedJenisId, setSelectedJenisId] = useState(null);
  const [selectedKegiatanId, setSelectedKegiatanId] = useState(null);

  const [isLoadingEditData, setIsLoadingEditData] = useState(false);
  const [kodeEkoError, setKodeEkoError] = useState("");
  const [kodeRekError, setKodeRekError] = useState("");

  const [formData, setFormData] = useState({
    id: Date.now(),
    rincian_id: rincian_id || null,
    kodeRekEkonomi: "",
    pendapatanBelanja: "",
    jenis: "",
    objek: "",
    kodeRekBidang: "",
    bidang: "",
    subBidang: "",
    kegiatan: "",
    anggaran: "",
    kelompok: "",
    volumeOutput: "",
    volumeInput: "",
    satuanOutput: "",
    satuanInput: "",
    sumberDana: "",
  });

  // ====== UTILITIES (parsing/formatting/validation) ======
  const ekoParse = (s) =>
    (s || "")
      .toString()
      .replace(/\./g, " ")
      .replace(/[^\d \-]+/g, "")
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const ekoFormat = (parts) => {
    const [a = "", b = "", c = "", d = ""] = parts;
    const out = [];
    if (a) out.push(String(parseInt(a, 10)));
    if (b) out.push(String(parseInt(b, 10)));
    if (c) out.push(String(parseInt(c, 10)));
    if (d) {
      if (d.includes("-")) out.push(d);
      else out.push(String(d).padStart(2, "0"));
    }
    return out.join(" ");
  };

  const validateKodeEko = (kode) => {
    if (!kode) return "";
    const clean = kode.replace(/\./g, " ").trim();
    const pattern = /^\d+(\s+\d+(\s+\d+(\s+(\d{1,2}|\d{1,2}-\d{1,2}))?)?)?$/;
    if (!pattern.test(clean))
      return "Format harus 'A B C DD' (contoh: 4 1 1 01 atau 4 1 1 90-99)";
    const p = clean.split(/\s+/);
    if (p[0] && p[0].length > 1) return "Akun (A) 1 digit";
    if (p[1] && p[1].length > 1) return "Kelompok (B) 1 digit";
    if (p[2] && p[2].length > 1) return "Jenis (C) 1 digit";
    if (p[3]) {
      if (p[3].includes("-")) {
        const rangeParts = p[3].split("-");
        if (
          rangeParts.length !== 2 ||
          rangeParts[0].length > 2 ||
          rangeParts[1].length > 2 ||
          !/^\d+$/.test(rangeParts[0]) ||
          !/^\d+$/.test(rangeParts[1])
        ) {
          return "Range objek harus format DD-DD (contoh: 90-99)";
        }
      } else if (p[3].length > 2) {
        return "Objek (DD) max 2 digit";
      }
    }
    return "";
  };

  const formatEkoFromFullCode = (full) => ekoFormat(ekoParse(full));

  const validateKodeRek = (kode) => {
    if (!kode) return "";
    const cleanKode = kode.replace(/\./g, " ").trim();
    const pattern = /^\d+(\s+\d+(\s+(\d{1,2}|\d{1,2}-\d{1,2}))?)?$/;
    if (!pattern.test(cleanKode)) return "Format kode harus 'x x xx' (contoh: 1 2 03)";
    const parts = cleanKode.split(/\s+/);
    if (parts[0] && parts[0].length > 1) return "Kode bidang harus 1 digit";
    if (parts[1] && parts[1].length > 1) return "Kode sub-bidang harus 1 digit";
    if (parts[2]) {
      if (parts[2].includes("-")) {
        const rangeParts = parts[2].split("-");
        if (
          rangeParts.length !== 2 ||
          rangeParts[0].length > 2 ||
          rangeParts[1].length > 2 ||
          !/^\d+$/.test(rangeParts[0]) ||
          !/^\d+$/.test(rangeParts[1])
        ) {
          return "Range kegiatan harus format xx-xx (contoh: 90-99)";
        }
      } else if (parts[2].length > 2) {
        return "Kode kegiatan max 2 digit";
      }
    }
    return "";
  };

  const formatKodeRek = (kode) => {
    const cleanKode = kode.replace(/\./g, " ");
    const parts = cleanKode.split(/\s+/);
    const formattedParts = parts.map((part, index) => {
      if (index === 2) {
        if (part.includes("-")) return part;
        return part.padStart(2, "0");
      }
      return parseInt(part);
    });
    return formattedParts.join(" ");
  };

  const sanitizeNumber = (val) => {
    if (val === null || val === undefined) return 0;
    const s = String(val).replace(/\s/g, "").replace(/[^0-9.,-]/g, "");
    if (s.indexOf(",") > -1 && s.indexOf(".") > -1) {
      return Number(s.replace(/\./g, "").replace(",", ".")) || 0;
    }
    if (s.indexOf(".") > -1 && s.indexOf(",") === -1) {
      if ((s.match(/\./g) || []).length > 1) {
        return Number(s.replace(/\./g, "")) || 0;
      }
      return Number(s) || 0;
    }
    if (s.indexOf(",") > -1) return Number(s.replace(",", ".")) || 0;
    return Number(s) || 0;
  };

  const formatAnggaranInput = (value) => {
    if (value === null || value === undefined || value === "") return "";
    let cleanedValue = String(value).replace(/[^0-9]/g, "");
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

  // Fetch master dropdown data
  useEffect(() => {
    async function fetchAllDropdownOptions() {
      try {
        const response = await fetch(`${API}/all-dropdown-options`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const { data } = await response.json();

        setAllAkunOptions(data.akun.map((item) => item.uraian));
        setAllJenisOptions(data.jenis.map((item) => item.uraian));
        setAllObjekOptions(data.objek.map((item) => item.uraian));
        setAllKelompokOptions(data.kelompok.map((item) => item.uraian));
        setAllBidangOptions(data.bidang.map((item) => item.uraian));
        setAllSubBidangOptions(data.subBidang.map((item) => item.uraian));
        setAllKegiatanOptions(data.kegiatan.map((item) => item.uraian));

        setAkunOptions(data.akun.map((item) => item.uraian));
        setJenisOptions(data.jenis.map((item) => item.uraian));
        setObjekOptions(data.objek.map((item) => item.uraian));
        setKelompokOptions(data.kelompok.map((item) => item.uraian));
        setBidangOptions(data.bidang.map((item) => item.uraian));
        setSubBidangOptions(data.subBidang.map((item) => item.uraian));
        setKegiatanOptions(data.kegiatan.map((item) => item.uraian));

        setBidangData(data.bidang);
        setSubBidangData(data.subBidang);
        setKegiatanData(data.kegiatan);
        setAkunData(data.akun);
        setKelompokData(data.kelompok);
        setJenisData(data.jenis);
        setObjekData(data.objek);
      } catch (error) {
        console.error("Failed to fetch all dropdown options:", error);
      }
    }
    fetchAllDropdownOptions();
  }, []);

  // If rincian_id is provided, fetch parent (rincian) and keep it to show and to pre-fill defaults
  useEffect(() => {
    if (!rincian_id) return;
    async function fetchParentItem() {
      try {
        const response = await fetch(`${API}/draft/rincian/${rincian_id}`);
        if (!response.ok) throw new Error("Gagal memuat data parent item dari API.");
        const result = await response.json();
        const parent = result.data || result;
        if (parent) {
          setParentItem(parent);
          // also set some default fields from parent:
          setFormData((prev) => ({
            ...prev,
            rincian_id: rincian_id,
            sumberDana: parent.sumber_dana || prev.sumberDana || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching parent item:", error);
      }
    }
    fetchParentItem();
  }, [rincian_id]);

  // When master data and parentItem exist, try to set selected ids from parent so penjabaran is connected to the same econ/func codes
  useEffect(() => {
    if (!parentItem) return;
    // Wait until master lists loaded
    if (akunData.length === 0 && kelompokData.length === 0) return;

    try {
      // parentItem.kode_ekonomi_id may be at akun or kelompok level
      if (parentItem.kode_ekonomi_id) {
        const exactEkonomiItem =
          akunData.find((a) => String(a.id) === String(parentItem.kode_ekonomi_id)) ||
          kelompokData.find((k) => String(k.id) === String(parentItem.kode_ekonomi_id));
        if (exactEkonomiItem) {
          if (!exactEkonomiItem.parent_id) {
            setSelectedAkunId(exactEkonomiItem.id);
            setFormData((p) => ({ ...p, pendapatanBelanja: exactEkonomiItem.uraian }));
          } else {
            setSelectedKelompokId(exactEkonomiItem.id);
            // set akun parent too
            const parentAkun = akunData.find((a) => String(a.id) === String(exactEkonomiItem.parent_id));
            if (parentAkun) {
              setSelectedAkunId(parentAkun.id);
              setFormData((p) => ({ ...p, pendapatanBelanja: parentAkun.uraian }));
            }
            setFormData((p) => ({ ...p, kelompok: exactEkonomiItem.uraian }));
          }
        }
      }

      // parentItem.kode_fungsi_id may be bidang/sub-bidang/kegiatan
      if (parentItem.kode_fungsi_id) {
        const exactFungsiItem =
          bidangData.find((b) => String(b.id) === String(parentItem.kode_fungsi_id)) ||
          subBidangData.find((s) => String(s.id) === String(parentItem.kode_fungsi_id)) ||
          kegiatanData.find((k) => String(k.id) === String(parentItem.kode_fungsi_id));
        if (exactFungsiItem) {
          const inBidang = bidangData.some((b) => b.id === exactFungsiItem.id);
          const inSub = subBidangData.some((s) => s.id === exactFungsiItem.id);
          const inKeg = kegiatanData.some((k) => k.id === exactFungsiItem.id);

          if (inBidang) {
            setSelectedBidangId(exactFungsiItem.id);
            setFormData((p) => ({ ...p, bidang: exactFungsiItem.uraian }));
          } else if (inSub) {
            setSelectedSubBidangId(exactFungsiItem.id);
            const parentBidang = bidangData.find((b) => String(b.id) === String(exactFungsiItem.parent_id));
            if (parentBidang) {
              setSelectedBidangId(parentBidang.id);
              setFormData((p) => ({ ...p, bidang: parentBidang.uraian }));
            }
            setFormData((p) => ({ ...p, subBidang: exactFungsiItem.uraian }));
          } else if (inKeg) {
            setSelectedKegiatanId(exactFungsiItem.id);
            const sub = subBidangData.find((s) => String(s.id) === String(exactFungsiItem.parent_id));
            if (sub) {
              setSelectedSubBidangId(sub.id);
              const parentBidang = bidangData.find((b) => String(b.id) === String(sub.parent_id));
              if (parentBidang) {
                setSelectedBidangId(parentBidang.id);
                setFormData((p) => ({ ...p, bidang: parentBidang.uraian }));
              }
              setFormData((p) => ({ ...p, subBidang: sub.uraian }));
            }
            setFormData((p) => ({ ...p, kegiatan: exactFungsiItem.uraian }));
          }
        }
      }

      // If parent has anggaran, show it in parent UI only (we already set parentItem)
    } catch (err) {
      console.error("Error mapping parent item to selections:", err);
    }
  }, [parentItem, akunData, kelompokData, bidangData, subBidangData, kegiatanData]);

  // Filtering child dropdowns when parent selection changes
  useEffect(() => {
    if (selectedBidangId && subBidangData.length > 0) {
      const filtered = subBidangData.filter((item) => item.parent_id === selectedBidangId);
      setSubBidangOptions(filtered.map((i) => i.uraian));
    } else {
      setSubBidangOptions(allSubBidangOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("subBidang", "");
      handleOnChange("kegiatan", "");
      setSelectedSubBidangId(null);
      setSelectedKegiatanId(null);
    }
  }, [selectedBidangId, subBidangData, allSubBidangOptions]);

  useEffect(() => {
    if (selectedSubBidangId && kegiatanData.length > 0) {
      const filtered = kegiatanData.filter((item) => item.parent_id === selectedSubBidangId);
      setKegiatanOptions(filtered.map((i) => i.uraian));
    } else {
      setKegiatanOptions(allKegiatanOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("kegiatan", "");
      setSelectedKegiatanId(null);
    }
  }, [selectedSubBidangId, kegiatanData, allKegiatanOptions]);

  useEffect(() => {
    if (selectedAkunId && kelompokData.length > 0) {
      const filtered = kelompokData.filter((item) => item.parent_id === selectedAkunId);
      setKelompokOptions(filtered.map((i) => i.uraian));
    } else {
      setKelompokOptions(allKelompokOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("kelompok", "");
      handleOnChange("jenis", "");
      handleOnChange("objek", "");
      setSelectedKelompokId(null);
      setSelectedJenisId(null);
    }
  }, [selectedAkunId, kelompokData, allKelompokOptions]);

  useEffect(() => {
    if (selectedKelompokId && jenisData.length > 0) {
      const filtered = jenisData.filter((item) => item.parent_id === selectedKelompokId);
      setJenisOptions(filtered.map((i) => i.uraian));
    } else {
      setJenisOptions(allJenisOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("jenis", "");
      handleOnChange("objek", "");
      setSelectedJenisId(null);
    }
  }, [selectedKelompokId, jenisData, allJenisOptions]);

  useEffect(() => {
    if (selectedJenisId && objekData.length > 0) {
      const filtered = objekData.filter((item) => item.parent_id === selectedJenisId);
      setObjekOptions(filtered.map((i) => i.uraian));
    } else {
      setObjekOptions(allObjekOptions);
    }
    if (!isLoadingEditData) {
      handleOnChange("objek", "");
    }
  }, [selectedJenisId, objekData, allObjekOptions]);

  // If editing a penjabaran (id present), fetch its data and prefill (this is separate from parentItem)
  useEffect(() => {
    if (!id) return;
    // require master data loaded to map to ids
    if (
      akunData.length === 0 &&
      kelompokData.length === 0 &&
      bidangData.length === 0 &&
      subBidangData.length === 0 &&
      kegiatanData.length === 0 &&
      jenisData.length === 0 &&
      objekData.length === 0
    )
      return;

    async function fetchEdit() {
      try {
        setIsLoadingEditData(true);
        const res = await fetch(`${API}/draft/penjabaran/${id}`);
        if (!res.ok) throw new Error("Gagal memuat data penjabaran untuk edit.");
        const result = await res.json();
        const existing = result.data || result;

        // map fields to form
        setFormData((prev) => ({
          ...prev,
          ...existing,
          anggaran: existing.jumlah_anggaran ? String(Math.floor(existing.jumlah_anggaran)) : "",
          rincian_id: existing.rincian_id || prev.rincian_id,
        }));

        // map ekonomi ids
        if (existing.kode_ekonomi_id) {
          const exactEko =
            kelompokData.find((k) => String(k.id) === String(existing.kode_ekonomi_id)) ||
            akunData.find((a) => String(a.id) === String(existing.kode_ekonomi_id));
          if (exactEko) {
            if (!exactEko.parent_id) {
              setSelectedAkunId(exactEko.id);
              setFormData((p) => ({ ...p, pendapatanBelanja: exactEko.uraian }));
            } else {
              setSelectedKelompokId(exactEko.id);
              const parentAkun = akunData.find((a) => String(a.id) === String(exactEko.parent_id));
              if (parentAkun) {
                setSelectedAkunId(parentAkun.id);
                setFormData((p) => ({ ...p, pendapatanBelanja: parentAkun.uraian }));
              }
              setFormData((p) => ({ ...p, kelompok: exactEko.uraian }));
            }
          }
        }

        // map fungsi ids
        if (existing.kode_fungsi_id) {
          const exactFungsi =
            bidangData.find((b) => String(b.id) === String(existing.kode_fungsi_id)) ||
            subBidangData.find((s) => String(s.id) === String(existing.kode_fungsi_id)) ||
            kegiatanData.find((k) => String(k.id) === String(existing.kode_fungsi_id));
          if (exactFungsi) {
            const inBidang = bidangData.some((b) => b.id === exactFungsi.id);
            const inSub = subBidangData.some((s) => s.id === exactFungsi.id);
            const inKeg = kegiatanData.some((k) => k.id === exactFungsi.id);

            if (inBidang) {
              setSelectedBidangId(exactFungsi.id);
              setFormData((p) => ({ ...p, bidang: exactFungsi.uraian }));
            } else if (inSub) {
              setSelectedSubBidangId(exactFungsi.id);
              const parentBidang = bidangData.find((b) => String(b.id) === String(exactFungsi.parent_id));
              if (parentBidang) {
                setSelectedBidangId(parentBidang.id);
                setFormData((p) => ({ ...p, bidang: parentBidang.uraian }));
              }
              setFormData((p) => ({ ...p, subBidang: exactFungsi.uraian }));
            } else if (inKeg) {
              setSelectedKegiatanId(exactFungsi.id);
              const sub = subBidangData.find((s) => String(s.id) === String(exactFungsi.parent_id));
              if (sub) {
                setSelectedSubBidangId(sub.id);
                const parentBidang = bidangData.find((b) => String(b.id) === String(sub.parent_id));
                if (parentBidang) {
                  setSelectedBidangId(parentBidang.id);
                  setFormData((p) => ({ ...p, bidang: parentBidang.uraian }));
                }
                setFormData((p) => ({ ...p, subBidang: sub.uraian }));
              }
              setFormData((p) => ({ ...p, kegiatan: exactFungsi.uraian }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching penjabaran edit data:", error);
        alert("Gagal memuat data penjabaran untuk edit. Lihat konsol.");
      } finally {
        setIsLoadingEditData(false);
      }
    }

    fetchEdit();
  }, [id, akunData, kelompokData, bidangData, subBidangData, kegiatanData, jenisData, objekData]);

  // helper to set form field
  const handleOnChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Kode ekonomi handler (parsing like earlier component)
  const handleKodeRekEkonomiChange = (value) => {
    if (value === formData.kodeRekEkonomi) return;
    const err = validateKodeEko(value);
    setKodeEkoError(err);
    handleOnChange("kodeRekEkonomi", value);

    if (!value || value.trim() === "") {
      handleOnChange("pendapatanBelanja", "");
      handleOnChange("kelompok", "");
      handleOnChange("jenis", "");
      handleOnChange("objek", "");
      setAkunOptions(allAkunOptions);
      setKelompokOptions(allKelompokOptions);
      setJenisOptions(allJenisOptions);
      setObjekOptions(allObjekOptions);
      setSelectedAkunId(null);
      setSelectedKelompokId(null);
      setSelectedJenisId(null);
      return;
    }

    if (!err) {
      const parts = ekoParse(value);
      if (parts[0] && akunData.length > 0) {
        const matchedAkun = akunData.find((x) => ekoParse(x.full_code)[0] === parts[0]);
        if (matchedAkun) {
          setAkunOptions([matchedAkun.uraian]);
          handleOnChange("pendapatanBelanja", matchedAkun.uraian);
          setSelectedAkunId(matchedAkun.id);
        }
      }
      if (parts.length >= 2 && kelompokData.length > 0) {
        const matchedKelompok = kelompokData.find((x) => {
          const tok = ekoParse(x.full_code);
          return tok[0] === parts[0] && tok[1] === parts[1];
        });
        if (matchedKelompok) {
          setKelompokOptions([matchedKelompok.uraian]);
          handleOnChange("kelompok", matchedKelompok.uraian);
          setSelectedKelompokId(matchedKelompok.id);
        }
      }
      if (parts.length >= 3 && jenisData.length > 0) {
        const matchedJenis = jenisData.find((x) => {
          const tok = ekoParse(x.full_code);
          return tok[0] === parts[0] && tok[1] === parts[1] && tok[2] === parts[2];
        });
        if (matchedJenis) {
          setJenisOptions([matchedJenis.uraian]);
          handleOnChange("jenis", matchedJenis.uraian);
          setSelectedJenisId(matchedJenis.id);
        }
      }
      if (parts.length >= 4 && objekData.length > 0) {
        const matchedObjek = objekData.find((x) => {
          const tok = ekoParse(x.full_code);
          return tok[0] === parts[0] && tok[1] === parts[1] && tok[2] === parts[2] && tok[3] === parts[3];
        });
        if (matchedObjek) {
          setObjekOptions([matchedObjek.uraian]);
          handleOnChange("objek", matchedObjek.uraian);
        }
      }
    }
  };

  // Kode bidang handler
  const handleKodeRekBidangChange = (value) => {
    if (value === formData.kodeRekBidang) return;
    const error = validateKodeRek(value);
    setKodeRekError(error);
    handleOnChange("kodeRekBidang", value);

    if (!value || value.trim() === "") {
      setBidangOptions(allBidangOptions);
      setSubBidangOptions(allSubBidangOptions);
      setKegiatanOptions(allKegiatanOptions);
      setSelectedBidangId(null);
      setSelectedSubBidangId(null);
      setSelectedKegiatanId(null);
      handleOnChange("bidang", "");
      handleOnChange("subBidang", "");
      handleOnChange("kegiatan", "");
      return;
    }

    if (!error) {
      const cleanKode = value.replace(/\./g, " ").trim();
      const parts = cleanKode.split(/\s+/).filter(Boolean);
      if (parts[0]) {
        const matchedBidang = bidangData.find((b) => {
          const bParts = b.full_code.replace(/\./g, " ").trim().split(/\s+/);
          return bParts[0] === parts[0];
        });
        if (matchedBidang) {
          setBidangOptions([matchedBidang.uraian]);
          handleOnChange("bidang", matchedBidang.uraian);
          setSelectedBidangId(matchedBidang.id);
        }
        if (parts.length >= 2) {
          const matchedSub = subBidangData.find((s) => {
            const sParts = s.full_code.replace(/\./g, " ").trim().split(/\s+/);
            return sParts[0] === parts[0] && sParts[1] === parts[1];
          });
          if (matchedSub) {
            setSubBidangOptions([matchedSub.uraian]);
            handleOnChange("subBidang", matchedSub.uraian);
            setSelectedSubBidangId(matchedSub.id);
          }
        }
        if (parts.length >= 3) {
          const matchedKeg = kegiatanData.find((k) => {
            const kParts = k.full_code.replace(/\./g, " ").trim().split(/\s+/);
            return kParts[0] === parts[0] && kParts[1] === parts[1] && kParts[2] === parts[2];
          });
          if (matchedKeg) {
            setKegiatanOptions([matchedKeg.uraian]);
            handleOnChange("kegiatan", matchedKeg.uraian);
            setSelectedKegiatanId(matchedKeg.id);
          }
        }
      }
    }
  };

  // Save penjabaran — ensure it's linked to parent rincian by sending rincian_id and proper kode ids
  const handleSimpan = async () => {
    try {
      const kodeEkonomiIdToSend = selectedKelompokId || selectedAkunId || null;
      const kodeFungsiIdToSend = selectedKegiatanId || selectedSubBidangId || selectedBidangId || null;

      const payload = {
        rincian_id: formData.rincian_id || rincian_id || null,
        kode_ekonomi_id: kodeEkonomiIdToSend,
        kode_fungsi_id: kodeFungsiIdToSend,
        jumlah_anggaran: sanitizeNumber(formData.anggaran),
        sumber_dana: formData.sumberDana,
        // additional penjabaran-specific fields
        volume_output: formData.volumeOutput || null,
        volume_input: formData.volumeInput || null,
        satuan_output: formData.satuanOutput || null,
        satuan_input: formData.satuanInput || null,
        uraian: formData.objek || formData.jenis || formData.kelompok || formData.pendapatanBelanja || "",
      };

      const isEdit = !!id;
      // Use a dedicated penjabaran endpoint so backend can enforce relation; fallback to /draft/rincian if necessary
      const url = isEdit ? `${API}/draft/penjabaran/${id}` : `${API}/draft/penjabaran`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Respon bukan JSON: ${text.slice(0, 120)}`);
      }

      if (!res.ok) {
        const errorMsg = data.message || data.error || data.hint || "Gagal menyimpan data";
        throw new Error(errorMsg);
      }

      alert(data.message || "Data berhasil disimpan!");
      if (!buatLagi) {
        // Redirect to penjabaran list for that rincian (if available)
        const redirectPath = `/APBDes/output-draft-penjabaran${payload.rincian_id ? `?rincian_id=${payload.rincian_id}` : ""}`;
        router.push(redirectPath);
      } else {
        // reset form but keep rincian_id to keep creating linked penjabaran
        setFormData({
          id: Date.now(),
          rincian_id: rincian_id || null,
          kodeRekEkonomi: "",
          pendapatanBelanja: "",
          jenis: "",
          objek: "",
          kodeRekBidang: "",
          bidang: "",
          subBidang: "",
          kegiatan: "",
          anggaran: "",
          kelompok: "",
          volumeOutput: "",
          volumeInput: "",
          satuanOutput: "",
          satuanInput: "",
          sumberDana: "",
        });
        setSelectedAkunId(null);
        setSelectedBidangId(null);
        setSelectedKelompokId(null);
        setSelectedJenisId(null);
        setSelectedSubBidangId(null);
        setSelectedKegiatanId(null);
      }
    } catch (error) {
      console.error("Error saat menyimpan data:", error);
      alert(`❌ Gagal menyimpan data: ${error.message || JSON.stringify(error)}`);
    }
  };

  const handleHapus = async () => {
    if (!id) {
      // just reset form
      setFormData({
        id: Date.now(),
        rincian_id: rincian_id || null,
        kodeRekEkonomi: "",
        pendapatanBelanja: "",
        jenis: "",
        objek: "",
        kodeRekBidang: "",
        bidang: "",
        subBidang: "",
        kegiatan: "",
        anggaran: "",
        kelompok: "",
        volumeOutput: "",
        volumeInput: "",
        satuanOutput: "",
        satuanInput: "",
        sumberDana: "",
      });
      setSelectedAkunId(null);
      setSelectedBidangId(null);
      setSelectedKelompokId(null);
      setSelectedJenisId(null);
      setSelectedKegiatanId(null);
      alert("🧹 Form dikosongkan (tidak ada data yang dihapus)");
      return;
    }

    const confirmDelete = window.confirm("⚠ Apakah Anda yakin ingin menghapus data ini dari database?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/draft/penjabaran/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Gagal menghapus data. Status: ${res.status}`);
      }
      alert("🗑 Data berhasil dihapus!");
      const redirectPath = rincian_id ? `/APBDes/output-draft-penjabaran?rincian_id=${rincian_id}` : "/APBDes/output-draft-penjabaran";
      router.push(redirectPath);
    } catch (error) {
      console.error("Error saat menghapus data:", error);
      alert(`❌ Gagal menghapus data: ${error.message || JSON.stringify(error)}`);
    }
  };

  return (
    <main className="min-h-screen bg-white px-16 py-8">
      <BreadCrumb category="APBDes" title="Input Draft Penjabaran" />

      <h1 className="mb-6 text-base font-semibold text-black">
        {id ? "Edit Data Penjabaran" : rincian_id ? "Tambah Penjabaran Item" : "Input Data Penjabaran"}
      </h1>

      {parentItem && (
        <div className="mb-6 rounded-lg border-2 border-blue-300 bg-blue-50 px-4 py-3">
          <p className="text-sm font-medium text-blue-900">📋 Menambahkan penjabaran untuk:</p>
          <p className="text-sm text-blue-800 mt-1">
            <span className="font-semibold">
              {parentItem.objek || parentItem.jenis || parentItem.kelompok || parentItem.pendapatanBelanja}
            </span>
            {" - "}
            <span>
              Rp{Number(parentItem.jumlah_anggaran || parentItem.anggaran || 0).toLocaleString("id-ID", {
                minimumFractionDigits: 2,
              })}
            </span>
          </p>
        </div>
      )}

      {/* ===== KODE REKENING DAN URAIAN ===== */}
      <div className="mb-6 rounded-2xl border border-gray-400 px-6 py-6 overflow-x-auto">
        <h2 className="text-sm font-semibold text-[#011829] mb-4">Kode Rekening dan Uraian</h2>

        {/* Klasifikasi Ekonomi */}
        <div className="space-y-2 min-w-[900px]">
          <label className="block text-sm font-medium text-[#011829]">Klasifikasi Ekonomi</label>
          <div className="flex gap-3 w-full">
            <div className="w-[15%] min-w-[120px]">
              <TextInput placeholder="Kode Rek" value={formData.kodeRekEkonomi} onChange={handleKodeRekEkonomiChange} />
            </div>

            <div className="w-[28%] min-w-[200px]">
              <FormDropdown
                label="Pendapatan / Belanja / Pembiayaan"
                options={akunOptions}
                value={formData.pendapatanBelanja}
                onChange={(val) => {
                  if (!val) {
                    handleOnChange("pendapatanBelanja", "");
                    handleOnChange("kelompok", "");
                    handleOnChange("jenis", "");
                    handleOnChange("objek", "");
                    handleOnChange("kodeRekEkonomi", "");
                    setSelectedAkunId(null);
                    setSelectedKelompokId(null);
                    setSelectedJenisId(null);
                    setKodeEkoError("");
                    return;
                  }
                  const a = akunData.find((x) => x.uraian === val);
                  if (a) {
                    const kodeAkun = ekoFormat(ekoParse(a.full_code).slice(0, 1));
                    handleOnChange("pendapatanBelanja", val);
                    handleOnChange("kelompok", "");
                    handleOnChange("jenis", "");
                    handleOnChange("objek", "");
                    handleOnChange("kodeRekEkonomi", kodeAkun);
                    setSelectedAkunId(a.id);
                    setSelectedKelompokId(null);
                    setSelectedJenisId(null);
                    setKodeEkoError("");
                  }
                }}
              />
            </div>

            <div className="w-[28%] min-w-[200px]">
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
                      handleOnChange("jenis", "");
                      handleOnChange("objek", "");
                      handleOnChange("kodeRekEkonomi", kodeAkun);
                    } else {
                      handleOnChange("kelompok", "");
                      handleOnChange("jenis", "");
                      handleOnChange("objek", "");
                      handleOnChange("kodeRekEkonomi", "");
                    }
                    setSelectedKelompokId(null);
                    setSelectedJenisId(null);
                    setKodeEkoError("");
                    return;
                  }
                  const k = kelompokData.find((x) => x.uraian === val);
                  if (k) {
                    const kodeKelompok = ekoFormat(ekoParse(k.full_code).slice(0, 2));
                    handleOnChange("kelompok", val);
                    handleOnChange("jenis", "");
                    handleOnChange("objek", "");
                    handleOnChange("kodeRekEkonomi", kodeKelompok);
                    setSelectedKelompokId(k.id);
                    setSelectedJenisId(null);
                    setKodeEkoError("");
                  }
                }}
              />
            </div>

            <div className="w-[28%] min-w-[200px]">
              <FormDropdown
                label="Jenis"
                options={jenisOptions}
                value={formData.jenis}
                onChange={(val) => {
                  if (!val) {
                    handleOnChange("jenis", "");
                    handleOnChange("objek", "");
                    setSelectedJenisId(null);
                    setKodeEkoError("");
                    return;
                  }
                  const j = jenisData.find((x) => x.uraian === val);
                  if (j) {
                    const kodeJenis = ekoFormat(ekoParse(j.full_code).slice(0, 3));
                    handleOnChange("jenis", val);
                    handleOnChange("objek", "");
                    handleOnChange("kodeRekEkonomi", kodeJenis);
                    setSelectedJenisId(j.id);
                    setKodeEkoError("");
                  }
                }}
                disabled={!selectedKelompokId}
              />
            </div>

            <div className="w-[28%] min-w-[200px]">
              <FormDropdown
                label="Objek"
                options={objekOptions}
                value={formData.objek}
                onChange={(val) => {
                  if (!val) {
                    handleOnChange("objek", "");
                    setKodeEkoError("");
                    return;
                  }
                  const o = objekData.find((x) => x.uraian === val);
                  if (o) {
                    handleOnChange("objek", val);
                    handleOnChange("kodeRekEkonomi", formatEkoFromFullCode(o.full_code));
                    setKodeEkoError("");
                  }
                }}
                disabled={!selectedJenisId}
              />
            </div>
          </div>
        </div>

        {/* Klasifikasi Bidang Kegiatan */}
        <div className="space-y-2 min-w-[900px] mt-5">
          <label className="block text-sm font-medium text-[#011829]">Klasifikasi Bidang Kegiatan</label>
          <div className="flex gap-3 w-full">
            <div className="w-[15%] min-w-[120px]">
              <TextInput placeholder="Kode Rek" value={formData.kodeRekBidang} onChange={handleKodeRekBidangChange} />
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
                    setSelectedBidangId(null);
                    setSelectedSubBidangId(null);
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
                    setSelectedSubBidangId(null);
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
                    handleOnChange("subBidang", "");
                    handleOnChange("kegiatan", "");
                    handleOnChange("kodeRekBidang", formData.bidang ? formData.bidang : "");
                    setSelectedSubBidangId(null);
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
                    setSelectedSubBidangId(selectedSubBidang.id);
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
                    handleOnChange("kegiatan", "");
                    setKodeRekError("");
                    setSelectedKegiatanId(null);
                    return;
                  }
                  const selectedKegiatan = kegiatanData.find((k) => k.uraian === val);
                  if (selectedKegiatan) {
                    const parts = selectedKegiatan.full_code.replace(/\./g, " ").trim().split(/\s+/);
                    const kegiatanCode = parts[2].includes("-") ? parts[2] : parts[2].padStart(2, "0");
                    const formattedCode = `${parseInt(parts[0])} ${parseInt(parts[1])} ${kegiatanCode}`;
                    handleOnChange("kegiatan", val);
                    handleOnChange("kodeRekBidang", formattedCode);
                    setSelectedKegiatanId(selectedKegiatan.id);
                    setKodeRekError("");
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== KELUARAN / OUTPUT (only for belanja) ===== */}
      {String(formData.pendapatanBelanja || "").toLowerCase().includes("belanja") && (
        <div className="mb-6 rounded-2xl border border-gray-400 px-6 py-6 overflow-x-auto">
          <h2 className="text-sm font-semibold text-[#011829] mb-4">Keluaran / Output</h2>
          <div className="space-y-2 min-w-[900px]">
            <label className="block text-sm font-medium text-[#011829]">Volume</label>
            <div className="flex gap-3">
              <TextInput prefix="Jml" placeholder="Jumlah Output" value={formData.volumeOutput} onChange={(val) => handleOnChange("volumeOutput", val)} />
              <TextInput prefix="Jml" placeholder="Jumlah Input" value={formData.volumeInput} onChange={(val) => handleOnChange("volumeInput", val)} />
            </div>
          </div>

          <div className="space-y-2 min-w-[900px] mt-5">
            <label className="block text-sm font-medium text-[#011829]">Satuan</label>
            <div className="flex gap-3">
              <TextInput prefix="Jml" placeholder="Satuan Output" value={formData.satuanOutput} onChange={(val) => handleOnChange("satuanOutput", val)} />
              <TextInput prefix="Jml" placeholder="Satuan Input" value={formData.satuanInput} onChange={(val) => handleOnChange("satuanInput", val)} />
            </div>
          </div>
        </div>
      )}

      {/* ===== ANGGARAN & SUMBER DANA ===== */}
      <div className="mb-8 space-y-5 rounded-2xl border border-gray-400 px-6 py-6">
        <h2 className="text-sm font-semibold text-[#011829]">Anggaran dan Sumber Dana</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-[#011829]">Anggaran</label>
          <TextInput prefix="Rp" placeholder="0.000.000" value={formatAnggaranInput(formData.anggaran)} onChange={(val) => handleOnChange("anggaran", String(val).replace(/[^0-9]/g, ""))} />
        </div>

        {!String(formData.pendapatanBelanja || "").toLowerCase().includes("pendapatan") &&
          !String(formData.pendapatanBelanja || "").toLowerCase().includes("pembiayaan") && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#011829]">Sumber Dana</label>
              <FormDropdown label="PBH / DDS / ADD / DLL / PBP" options={sumberDanaOptions} value={formData.sumberDana} onChange={(val) => handleOnChange("sumberDana", val)} />
            </div>
          )}
      </div>

      {/* ===== BUTTONS ===== */}
      <div className="flex justify-between">
        <Button variant="danger" onClick={handleHapus}>
          Hapus
          <Trash width={16} height={16} />
        </Button>

        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setBuatLagi((prev) => !prev)} className="flex items-center gap-2 cursor-pointer select-none">
            <span className="text-sm text-gray-700">Buat lagi</span>
            {buatLagi ? (
              <ToggleRight width={28} height={28} className="text-blue-600 transition-colors duration-200" />
            ) : (
              <ToggleLeft width={28} height={28} className="text-gray-500 transition-colors duration-200" />
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