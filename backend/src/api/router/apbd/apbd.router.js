// src/api/routes/apbd.route.js
import { Router } from "express";
import { logError } from "../../../common/logger/logger.js";

// Middleware to augment req.log with a custom logError method
function augmentReqLogger(req, res, next) {
  if (req.log) {
    req.log.logError = (err, message, fields = {}) =>
      logError(err, message, fields, req.log);
  }
  next();
}

export default function createApbdRouter(apbdHandler) {
  const r = Router();

  // Apply the logger augmentation middleware to all routes in this router
  r.use(augmentReqLogger);

  //GET
  // General APBDes endpoints
  r.get("/", apbdHandler.getApbdes); // GET /api/apbd/
  r.get("/status/:id", apbdHandler.getApbdesStatus); // GET /api/apbd/status/:id

  // Opsi dropdown endpoints
  r.get("/kode-fungsi", apbdHandler.getKodeFungsi); // GET /api/apbd/kode-fungsi
  r.get("/bidang", apbdHandler.getBidang); // GET /api/apbd/bidang
  r.get("/sub-bidang", apbdHandler.getSubBidang); // GET /api/apbd/sub-bidang
  r.get("/kegiatan", apbdHandler.getKegiatan); // GET /api/apbd/kegiatan
  r.get("/kode-ekonomi", apbdHandler.getKodeEkonomi); // GET /api/apbd/kode-ekonomi
  r.get("/akun", apbdHandler.getAkun); // GET /api/apbd/akun
  r.get("/kelompok", apbdHandler.getKelompok); // GET /api/apbd/kelompok
  r.get("/jenis", apbdHandler.getJenis); // GET /api/apbd/jenis
  r.get("/objek", apbdHandler.getObjek); // GET /api/apbd/objek
  r.get("/dropdown-options", apbdHandler.getDropdownOptionsByKodeRekening); // GET /api/apbd/dropdown-options
  r.get("/all-dropdown-options", apbdHandler.getAllDropdownOptions); // GET /api/apbd/all-dropdown-options

  // Draft APBDes endpoints
  r.get("/draft/rincian", apbdHandler.getDraftApbdesList); // GET /api/apbd/draft/rincian
  r.get("/draft/rincian/:id", apbdHandler.getDraftApbdesById); // GET /api/apbd/draft/rincian/:id
  r.get("/draft/rincian/summary", apbdHandler.getDraftApbdesSummary); // GET /api/apbd/draft/rincian/summary

  // Draft Penjabaran APBDes endpoints
  r.get("/draft/penjabaran", apbdHandler.getDraftPenjabaranApbdesList); // GET /api/apbd/draft/penjabaran
  r.get(
    "/draft/penjabaran/:rincian_id",
    apbdHandler.getDraftPenjabaranApbdesById
  ); // GET /api/apbd/draft/penjabaran/:rincian_id
  r.get(
    "/draft/penjabaran/summary",
    apbdHandler.getDraftPenjabaranApbdesSummary
  ); // GET /api/apbd/draft/penjabaran/summary

  //POST
  r.post("/draft", apbdHandler.createApbdesDraft); // POST /api/apbd/draft
  r.post("/draft/rincian", apbdHandler.createApbdesRincian); // POST /api/apbd/draft/rincian
  r.post("/draft/rincian/post", apbdHandler.postDraftApbdes); // POST /api/apbd/draft/rincian/post
  r.post(
    "/draft/penjabaran/:id/penjabaran",
    apbdHandler.createApbdesRincianPenjabaran
  ); // POST /api/apbd/draft/penjabaran/:id/penjabaran
  r.post(
    "/draft/penjabaran/:id/penjabaran/post",
    apbdHandler.postDraftPenjabaranApbdes
  ); // POST /api/apbd/draft/penjabaran/:id/penjabaran/post

  // UPDATE & DELETE
  r.put("/draft/rincian/:id", apbdHandler.updateDraftApbdesItem); // PUT /api/apbd/draft/rincian/:id
  r.delete("/draft/rincian/:id", apbdHandler.deleteDraftApbdesItem); // DELETE /api/apbd/draft/rincian/:id
  r.put("/draft/penjabaran/:id", apbdHandler.updatePenjabaranApbdesItem); // PUT /api/apbd/draft/penjabaran/:id
  r.delete("/draft/penjabaran/:id", apbdHandler.deletePenjabaranApbdesItem); // DELETE /api/apbd/draft/penjabaran/:id

  return r;
}
