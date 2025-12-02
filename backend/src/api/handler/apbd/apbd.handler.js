// src/api/handler/apbd/apbd.handler.js
export default function createApbdHandler(ApbdService) {
  //create
  const createApbdesDraft = async (req, res, next) => {
    try {
      const { tahun } = req.body;
      const result = await ApbdService.createApbdesDraft(tahun);
      res.json(result);
    } catch (err) {
      next(err);
    }
  };

  const createApbdesRincian = async (req, res, next) => {
    try {
      const result = await ApbdService.createApbdesRincian(req.body);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  //get
  const getApbdes = async (req, res, next) => {
    try {
      const { id, tahun, status } = req.query;
      const result = await ApbdService.getApbdes({ id, tahun, status });
      res.json(result);
    } catch (e) {
      next(e);
    }
  };
  const getKodeFungsi = async (_req, res, next) => {
    try {
      const data = await ApbdService.getKodeFungsi();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getBidang = async (_req, res, next) => {
    try {
      const data = await ApbdService.getBidang();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getSubBidang = async (_req, res, next) => {
    try {
      const data = await ApbdService.getSubBidang();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getKegiatan = async (_req, res, next) => {
    try {
      const data = await ApbdService.getKegiatan();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getKodeEkonomi = async (_req, res, next) => {
    try {
      const data = await ApbdService.getKodeEkonomi();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getAkun = async (_req, res, next) => {
    try {
      const data = await ApbdService.getAkun();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getKelompok = async (_req, res, next) => {
    try {
      const data = await ApbdService.getKelompok();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getJenis = async (_req, res, next) => {
    try {
      const data = await ApbdService.getJenis();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getObjek = async (_req, res, next) => {
    try {
      const data = await ApbdService.getObjek();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getApbdesStatus = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await ApbdService.getApbdesStatus(id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getDraftApbdesList = async (_req, res, next) => {
    try {
      const data = await ApbdService.getDraftApbdesList();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getDraftApbdesById = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: false, message: "id_required" });
      }
      const data = await ApbdService.getDraftApbdesById(id);
      if (!data) {
        return res
          .status(404)
          .json({ success: false, message: "draft_not_found" });
      }
      res.json({ success: true, data });
    } catch (e) {
      console.error("Error getDraftApbdesById:", e);
      res
        .status(500)
        .json({ success: false, message: e.message || "internal_error" });
    }
  };

  const getDraftApbdesSummary = async (_req, res, next) => {
    try {
      const data = await ApbdService.getDraftApbdesSummary();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const updateDraftApbdesItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await ApbdService.updateDraftApbdesItem(id, data);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  // Hapus satu entri data APBDes
  const deleteDraftApbdesItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log("Attempting to delete APBDes rincian with ID:", id); // Add logging here
      const result = await ApbdService.deleteDraftApbdesItem(id);
      res.json({ message: "Data berhasil dihapus", deletedItem: result.deletedItem, total: result.total }); // Consistent response
    } catch (e) {
      console.error("Error deleting APBDes rincian:", e); // Add error logging
      next(e);
    }
  };

  const postDraftApbdes = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ApbdService.postDraftApbdes(id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  const createApbdesRincianPenjabaran = async (req, res, next) => {
    try {
      const payload = {
        ...req.body,
        rincian_id: req.params.id,
      };
      const result = await ApbdService.createApbdesRincianPenjabaran(payload);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  };

  const getDraftPenjabaranApbdesList = async (_req, res, next) => {
    try {
      const data = await ApbdService.getDraftPenjabaranApbdesList();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getDraftPenjabaranApbdesById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await ApbdService.getDraftPenjabaranApbdesById(id);
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const getDraftPenjabaranApbdesSummary = async (_req, res, next) => {
    try {
      const data = await ApbdService.getDraftPenjabaranApbdesSummary();
      res.json(data);
    } catch (e) {
      next(e);
    }
  };

  const postDraftPenjabaranApbdes = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ApbdService.postDraftPenjabaranApbdes(id);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  };

  const updatePenjabaranApbdesItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = req.body;
      const result = await ApbdService.updatePenjabaranApbdesItem(id, data);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  const deletePenjabaranApbdesItem = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await ApbdService.deletePenjabaranApbdesItem(id);
      res.json(result);
    } catch (e) {
      next(e);
    }
  };

  const getDropdownOptionsByKodeRekening = async (req, res, next) => {
    try {
      const { kodeRekening } = req.query;
      if (!kodeRekening) {
        return res
          .status(400)
          .json({ success: false, message: "kodeRekening_required" });
      }
      const data = await ApbdService.getDropdownOptionsByKodeRekening(
        kodeRekening
      );
      res.json({ success: true, data });
    } catch (e) {
      console.error("Error getDropdownOptionsByKodeRekening:", e);
      res.status(e.status || 500).json({
        success: false,
        message: e.message || "internal_error",
        error: e.error,
      });
    }
  };

  const getAllDropdownOptions = async (_req, res, next) => {
    try {
      const data = await ApbdService.getAllDropdownOptions();
      res.json({ success: true, data });
    } catch (e) {
      console.error("Error getAllDropdownOptions:", e);
      res.status(e.status || 500).json({
        success: false,
        message: e.message || "internal_error",
        error: e.error,
      });
    }
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
