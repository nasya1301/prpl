import createRepo from "../../../repository/kas-umum/kas-umum.repo.js";

const normalizeMonth = (m) => (m?.length === 7 ? `${m}-01` : m);

export default function createHandlers({ db }) {
  const repo = createRepo({ db }); // inject Pool dari server

  const getBku = async (req, res, next) => {
    try {
      const { month, rabId, rkkId } = req.query;
      if (!month)
        return res
          .status(400)
          .json({ error: "month_required", hint: "YYYY-MM atau YYYY-MM-DD" });
      const monthDate = normalizeMonth(month);

      const [rows, summary] = await Promise.all([
        repo.listBkuRows({ monthDate, rabId, rkkId }),
        repo.getBkuSummary({ monthDate, rabId, rkkId }),
      ]);

      res.json({ meta: { month: month.slice(0, 7) }, summary, rows });
    } catch (e) {
      next(e);
    }
  };

  const getBidang = async (_req, res, next) => {
    try {
      res.json(await repo.listBidang());
    } catch (e) {
      next(e);
    }
  };

  const getSubBidang = async (req, res, next) => {
    try {
      if (!req.query.bidangId)
        return res.status(400).json({ error: "bidangId_required" });
      res.json(await repo.listSubBidang(req.query.bidangId));
    } catch (e) {
      next(e);
    }
  };

  const getKegiatan = async (req, res, next) => {
    try {
      if (!req.query.subBidangId)
        return res.status(400).json({ error: "subBidangId_required" });
      res.json(await repo.listKegiatan(req.query.subBidangId));
    } catch (e) {
      next(e);
    }
  };

  return { getBku, getBidang, getSubBidang, getKegiatan };
}
