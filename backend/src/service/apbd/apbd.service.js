// src/service/apbd/apbd.service.js

export default function createApbdService(ApbdRepo) {
  const getApbdes = async ({ id, tahun, status }) => {
    if (!tahun) {
      throw {
        status: 400,
        error: "tahun_required",
        hint: "Format: YYYY",
      };
    }

    const rows = await ApbdRepo.listApbdesRows({ id, tahun, status });

    return {
      meta: { tahun },
      rows,
    };
  };

  const getKodeFungsi = async () => ApbdRepo.listKodeFungsi();

  const getBidang = async () => ApbdRepo.listBidang();

  const getSubBidang = async () => ApbdRepo.listSubBidang();

  const getKegiatan = async () => ApbdRepo.listKegiatan();

  const createApbdesDraft = async (tahun) => {
    tahun = tahun || new Date().getFullYear();

    let draft = await ApbdRepo.getDraftApbdesByYear(tahun);
    if (!draft) draft = await ApbdRepo.createApbdesDraft(tahun);

    return {
      message: "Draft APBDes berhasil dibuat",
      data: draft,
    };
  };

  const createApbdesRincian = async (payload) => {
    let apbdesId = payload.apbdes_id;
    // Jika tidak ada apbdes_id → buat draft baru
    if (!apbdesId) {
      const tahun = new Date().getFullYear();
      const draft = await ApbdRepo.createApbdesDraft(tahun);
      apbdesId = draft.id;
    }
    
    // Convert full_code ke id jika diperlukan
    // Frontend bisa kirim dalam format "5 3 2 01" (full_code) atau sudah id
    if (payload.kode_ekonomi_id) {
      // Cek apakah ini full_code (ada spasi) atau sudah id (ada titik)
      if (/\s/.test(payload.kode_ekonomi_id)) {
        // Ini full_code, convert ke id
        const ekonomiId = await ApbdRepo.getKodeEkonomiIdByFullCode(payload.kode_ekonomi_id);
        if (!ekonomiId) {
          throw {
            status: 400,
            error: 'invalid_kode_ekonomi',
            message: `Kode ekonomi "${payload.kode_ekonomi_id}" tidak ditemukan`,
          };
        }
        payload.kode_ekonomi_id = ekonomiId;
      }
    }

    if (payload.kode_fungsi_id) {
      // Cek apakah ini full_code (ada spasi) atau sudah id (ada titik)
      if (/\s/.test(payload.kode_fungsi_id)) {
        // Ini full_code, convert ke id
        const fungsiId = await ApbdRepo.getKodeFungsiIdByFullCode(payload.kode_fungsi_id);
        if (!fungsiId) {
          throw {
            status: 400,
            error: 'invalid_kode_fungsi',
            message: `Kode fungsi "${payload.kode_fungsi_id}" tidak ditemukan`,
          };
        }
        payload.kode_fungsi_id = fungsiId;
      }
    }

    // Tambahkan apbdes_id ke payload
    payload.apbdes_id = apbdesId;
    // Insert rincian
    const rincian = await ApbdRepo.createApbdesRincian(payload);
    // Hitung ulang total
    const total = await ApbdRepo.recalculateDraftApbdesTotals(apbdesId);
    return {
      message: "Rincian berhasil ditambahkan",
      data: rincian,
      total,
    };
  };

  const getKodeEkonomi = async () => ApbdRepo.listKodeEkonomi();

  const getAkun = async () => ApbdRepo.listAkun();

  const getKelompok = async () => ApbdRepo.listKelompok();

  const getJenis = async () => ApbdRepo.listJenis();

  const getObjek = async () => ApbdRepo.listObjek();

  const getApbdesStatus = async (id) => {
    if (!id) throw { status: 400, error: "id_required" };
    const status = await ApbdRepo.getApbdesStatus(id);
    return status;
  };

  const getDraftApbdesList = async () => ApbdRepo.getDraftApbdesList();

  const getDraftApbdesById = async (id) => {
    if (!id) throw { status: 400, error: "id_required" };
    const draft = await ApbdRepo.getDraftApbdesById(id);
    if (!draft) throw { status: 404, error: "draft_not_found" };
    return draft;
  };

  const getDraftApbdesSummary = async () => {
    const summary = await ApbdRepo.getDraftApbdesSummary();
    return {
      pendapatan: summary.pendapatan || 0,
      belanja: summary.belanja || 0,
      pembiayaan: summary.pembiayaan || 0,
      raw: summary,
    };
  };

  const updateDraftApbdesItem = async (id, data) => {
    // Convert full_code ke id jika diperlukan (sama seperti create)
    if (data.kode_ekonomi_id && /\s/.test(data.kode_ekonomi_id)) {
      const ekonomiId = await ApbdRepo.getKodeEkonomiIdByFullCode(data.kode_ekonomi_id);
      if (!ekonomiId) {
        throw {
          status: 400,
          error: 'invalid_kode_ekonomi',
          message: `Kode ekonomi "${data.kode_ekonomi_id}" tidak ditemukan`,
        };
      }
      data.kode_ekonomi_id = ekonomiId;
    }

    if (data.kode_fungsi_id && /\s/.test(data.kode_fungsi_id)) {
      const fungsiId = await ApbdRepo.getKodeFungsiIdByFullCode(data.kode_fungsi_id);
      if (!fungsiId) {
        throw {
          status: 400,
          error: 'invalid_kode_fungsi',
          message: `Kode fungsi "${data.kode_fungsi_id}" tidak ditemukan`,
        };
      }
      data.kode_fungsi_id = fungsiId;
    }

    const updatedItem = await ApbdRepo.updateDraftApbdesItem(id, data);
    
    // Get apbdes_id from the updated item
    const apbdesId = updatedItem.apbdes_id;

    const total = await ApbdRepo.recalculateDraftApbdesTotals(apbdesId);
    return { updatedItem, total };
  };

  const deleteDraftApbdesItem = async (id) => {
    const deletedItem = await ApbdRepo.deleteDraftApbdesItem(id);
    const total = await ApbdRepo.recalculateDraftApbdesTotals(
      deletedItem.apbd_id
    ); // Hitung ulang total
    return { deletedItem, total };
  };

  const postDraftApbdes = async (id) => {
    if (!id) throw { status: 400, error: "id_required" };
    const currentStatus = await ApbdRepo.getApbdesStatus(id);
    if (currentStatus === "posted") {
      throw {
        status: 409,
        error: "apbdes_already_posted",
        message: "APBDes ini sudah diposting dan tidak dapat diubah lagi.",
      };
    }

    const postedApbdes = await ApbdRepo.postDraftApbdes(id);
    return {
      message: "APBDes berhasil diposting.",
      data: postedApbdes,
    };
  };

  const createApbdesRincianPenjabaran = async (payload) => {
    // Convert full_code ke id jika diperlukan (sama seperti create rincian)
    if (payload.kode_ekonomi_id && /\s/.test(payload.kode_ekonomi_id)) {
      const ekonomiId = await ApbdRepo.getKodeEkonomiIdByFullCode(payload.kode_ekonomi_id);
      if (!ekonomiId) {
        throw {
          status: 400,
          error: 'invalid_kode_ekonomi',
          message: `Kode ekonomi "${payload.kode_ekonomi_id}" tidak ditemukan`,
        };
      }
      payload.kode_ekonomi_id = ekonomiId;
    }

    if (payload.kode_fungsi_id && /\s/.test(payload.kode_fungsi_id)) {
      const fungsiId = await ApbdRepo.getKodeFungsiIdByFullCode(payload.kode_fungsi_id);
      if (!fungsiId) {
        throw {
          status: 400,
          error: 'invalid_kode_fungsi',
          message: `Kode fungsi "${payload.kode_fungsi_id}" tidak ditemukan`,
        };
      }
      payload.kode_fungsi_id = fungsiId;
    }

    // Insert penjabaran
    const newItem = await ApbdRepo.createApbdesRincianPenjabaran(payload);
    // Cari apbdes_id dari rincian
    let apbdesId = await ApbdRepo.getApbdesIdByRincianId(payload.rincian_id);
    // Kalau tidak ada → buat draft baru
    if (!apbdesId) {
      const tahun = new Date().getFullYear();
      const draft = await ApbdRepo.createApbdesDraft(tahun);
      apbdesId = draft.id;
    }
    // Hitung total ulang
    const total = await ApbdRepo.recalculateDraftApbdesTotals(apbdesId);
    return {
      message: "Penjabaran berhasil ditambahkan",
      data: newItem,
      total,
    };
  };

  const getDraftPenjabaranApbdesList = async () =>
    ApbdRepo.getDraftPenjabaranApbdesList();

  const getDraftPenjabaranApbdesById = async (id) => {
    if (!id) throw { status: 400, error: "id_required" };
    const draft = await ApbdRepo.getDraftPenjabaranApbdesById(id);
    if (!draft) throw { status: 404, error: "draft_not_found" };
    return draft;
  };

  const getDraftPenjabaranApbdesSummary = async () => {
    const summary = await ApbdRepo.getDraftPenjabaranApbdesSummary();
    return {
      pendapatan: summary.pendapatan || 0,
      belanja: summary.belanja || 0,
      pembiayaan: summary.pembiayaan || 0,
      raw: summary,
    };
  };

  const postDraftPenjabaranApbdes = async (id) => {
    if (!id) throw { status: 400, error: "id_required" };
    const currentStatus = await ApbdRepo.getApbdesStatus(id);
    if (currentStatus === "posted") {
      throw {
        status: 409,
        error: "apbdes_already_posted",
        message: "APBDes ini sudah diposting dan tidak dapat diubah lagi.",
      };
    }

    const postedApbdes = await ApbdRepo.postDraftPenjabaranApbdes(id);
    return {
      message: "APBDes berhasil diposting.",
      data: postedApbdes,
    };
  };

  const updatePenjabaranApbdesItem = async (id, data) => {
    // Convert full_code ke id jika diperlukan (sama seperti create)
    if (data.kode_ekonomi_id && /\s/.test(data.kode_ekonomi_id)) {
      const ekonomiId = await ApbdRepo.getKodeEkonomiIdByFullCode(data.kode_ekonomi_id);
      if (!ekonomiId) {
        throw {
          status: 400,
          error: 'invalid_kode_ekonomi',
          message: `Kode ekonomi "${data.kode_ekonomi_id}" tidak ditemukan`,
        };
      }
      data.kode_ekonomi_id = ekonomiId;
    }

    if (data.kode_fungsi_id && /\s/.test(data.kode_fungsi_id)) {
      const fungsiId = await ApbdRepo.getKodeFungsiIdByFullCode(data.kode_fungsi_id);
      if (!fungsiId) {
        throw {
          status: 400,
          error: 'invalid_kode_fungsi',
          message: `Kode fungsi "${data.kode_fungsi_id}" tidak ditemukan`,
        };
      }
      data.kode_fungsi_id = fungsiId;
    }

    const updatedItem = await ApbdRepo.updatePenjabaranApbdesItem(id, data);
    
    // Get apbdes_id via rincian_id
    const apbdesId = await ApbdRepo.getApbdesIdByRincianId(updatedItem.rincian_id);

    const total = await ApbdRepo.recalculateDraftApbdesTotals(apbdesId);
    return { updatedItem, total };
  };

  const deletePenjabaranApbdesItem = async (id) => {
    const deletedItem = await ApbdRepo.deletePenjabaranApbdesItem(id);
    const total = await ApbdRepo.recalculateDraftApbdesTotals(
      deletedItem.penjabaran_id
    ); // Hitung ulang total
    return { deletedItem, total };
  };

  const getDropdownOptionsByKodeRekening = async (kodeRekening) => {
    const dotParts = kodeRekening.split(".");
    const fullCode = dotParts.join(" "); // Convert to space-separated for repo

    // Check for Kode Fungsi (Bidang Kegiatan)
    // Bidang: 1 part (e.g., "1")
    // Sub Bidang: 2 parts (e.g., "1.1")
    // Kegiatan: 3 parts (e.g., "1.1.01")
    if (dotParts.length >= 1 && dotParts.length <= 3) {
      const result = await ApbdRepo.getKodeFungsiDetailsByFullCode(fullCode);
      if (result && result.kegiatan) {
        return {
          type: "kode_fungsi",
          bidang: result.bidang,
          subBidang: result.subBidang,
          kegiatan: result.kegiatan,
        };
      }
    }

    // Check for Kode Ekonomi (Pendapatan / Belanja / Pembiayaan)
    // Akun: 1 part (e.g., "4")
    // Kelompok: 2 parts (e.g., "4.1")
    // Jenis: 3 parts (e.g., "4.1.1")
    // Objek: 4 parts (e.g., "4.1.1.01")
    if (dotParts.length >= 1 && dotParts.length <= 4) {
      const result = await ApbdRepo.getKodeEkonomiDetailsByFullCode(fullCode);
      if (result && result.objek) {
        // Fetch all options for dependent dropdowns
        const allKelompok = await ApbdRepo.listKelompok(result.akun.id);
        const allJenis = await ApbdRepo.listJenis(result.kelompok.id);
        const allObjek = await ApbdRepo.listObjek(result.jenis.id);

        return {
          type: "kode_ekonomi",
          akun: result.akun,
          kelompok: result.kelompok,
          jenis: result.jenis,
          objek: result.objek,
          allKelompok: allKelompok, // Return all options, not just the selected one
          allJenis: allJenis, // Return all options
          allObjek: allObjek, // Return all options
        };
      }
    }

    throw {
      status: 400,
      error: "invalid_kode_rekening",
      message: "Kode rekening tidak ditemukan atau tidak valid.",
    };
  };

  const getAllDropdownOptions = async () => {
    const bidang = await ApbdRepo.listBidang();
    const subBidang = await ApbdRepo.listSubBidang();
    const kegiatan = await ApbdRepo.listKegiatan();
    const akun = await ApbdRepo.listAkun();
    const kelompok = await ApbdRepo.listKelompok();
    const jenis = await ApbdRepo.listJenis();
    const objek = await ApbdRepo.listObjek();

    return {
      bidang,
      subBidang,
      kegiatan,
      akun,
      kelompok,
      jenis,
      objek,
    };
  };

  return {
    //tabel apbdes
    createApbdesDraft,

    //input form apbdes rincian
    getBidang,
    getKodeFungsi,
    getSubBidang,
    getKegiatan,
    getKodeEkonomi,
    getAkun,
    getKelompok,
    getJenis,
    getObjek,
    createApbdesRincian,

    //output apbdes rincian
    getDraftApbdesList,
    getDraftApbdesById,
    getDraftApbdesSummary,
    updateDraftApbdesItem,
    deleteDraftApbdesItem,
    postDraftApbdes,

    //input form apbdes rincian penjabaran
    createApbdesRincianPenjabaran,

    //output draft apbdes rincian penjabaran
    getDraftPenjabaranApbdesList,
    getDraftPenjabaranApbdesById,
    getDraftPenjabaranApbdesSummary,
    updatePenjabaranApbdesItem,
    deletePenjabaranApbdesItem,
    postDraftPenjabaranApbdes,

    //buku apbdes
    getApbdes,
    getApbdesStatus,

    //dropdown helper
    getDropdownOptionsByKodeRekening,
    getAllDropdownOptions,
  };
}
