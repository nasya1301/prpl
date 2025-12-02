import { Router } from "express";
import createHandlers from "../../handler/kas-umum/kas-umum.handler.js";

export default function createKasUmumRouter({ db }) {
  const r = Router();
  const h = createHandlers({ db });

  r.get("/", h.getBku);
  r.get("/bidang", h.getBidang);
  r.get("/sub-bidang", h.getSubBidang);
  r.get("/kegiatan", h.getKegiatan);

  return r;
}
