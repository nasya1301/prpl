// src/repository/kas-umum/kas-umum.repo.js
export default function createRepo({ db }) {
  // db = instance Pool (pg)
  const P = (i) => `$${i}`;

  // Helper untuk pencocokan bulan
  const monthBku = () =>
    `DATE_TRUNC('month', bku.tanggal) = DATE_TRUNC('month', ${P(1)}::date)`;
  const monthRaw = () =>
    `DATE_TRUNC('month', tanggal) = DATE_TRUNC('month', ${P(1)}::date)`;

  /**
   * Ambil daftar transaksi BKU (Buku Kas Umum)
   */
  async function listBkuRows({ monthDate, rabId, rkkId }) {
    const where = [monthBku()];
    const params = [monthDate];
    let join = "";

    if (rabId) {
      where.push(`bku.rab_id = ${P(2)}`);
      params.push(rabId);
    } else if (rkkId) {
      join = `LEFT JOIN rab r ON r.id = bku.rab_id`;
      where.push(`r.rkk_id = ${P(2)}`);
      params.push(rkkId);
    }

    const sql = `
      SELECT ROW_NUMBER() OVER (ORDER BY bku.tanggal, bku.id) AS no,
             bku.tanggal,
             ke.full_code AS kode_rekening,
             bku.uraian,
             bku.penerimaan AS pemasukan,
             bku.pengeluaran,
             bku.no_bukti,
             (bku.penerimaan - bku.pengeluaran) AS netto_transaksi,
             bku.saldo_after AS saldo
      FROM buku_kas_umum bku
      LEFT JOIN kode_ekonomi ke ON ke.id = bku.kode_ekonomi_id
      ${join}
      WHERE ${where.join(" AND ")}
      ORDER BY bku.tanggal, bku.id
    `;

    const { rows } = await db.query(sql, params);
    return rows;
  }

  /**
   * Hitung rekapitulasi total pemasukan/pengeluaran/netto BKU
   */
  async function getBkuSummary({ monthDate, rabId, rkkId }) {
    const where = [monthRaw()];
    const params = [monthDate];

    if (rabId) {
      where.push(`rab_id = ${P(2)}`);
      params.push(rabId);
    } else if (rkkId) {
      where.push(
        `EXISTS (
          SELECT 1
          FROM rab r
          WHERE r.id = buku_kas_umum.rab_id
          AND r.rkk_id = ${P(2)}
        )`
      );
      params.push(rkkId);
    }

    const sql = `
      SELECT
        COALESCE(SUM(penerimaan), 0) AS total_pemasukan,
        COALESCE(SUM(pengeluaran), 0) AS total_pengeluaran,
        COALESCE(SUM(penerimaan - pengeluaran), 0) AS total_netto
      FROM buku_kas_umum
      WHERE ${where.join(" AND ")}
    `;

    const {
      rows: [row],
    } = await db.query(sql, params);

    return row || { total_pemasukan: 0, total_pengeluaran: 0, total_netto: 0 };
  }

  /**
   * Dropdown kode fungsi — disesuaikan dgn level:
   * level 1 = Bidang, 2 = Sub-bidang, 3 = Kegiatan
   */
  const listBidang = async () => {
    const { rows } = await db.query(`
      SELECT id, full_code, uraian
      FROM kode_fungsi
      WHERE level = '1'
      ORDER BY full_code
    `);
    return rows;
  };

  const listSubBidang = async (bidangId) => {
    const { rows } = await db.query(
      `
      SELECT id, full_code, uraian
      FROM kode_fungsi
      WHERE level = '2' AND parent_id = ${P(1)}
      ORDER BY full_code
    `,
      [bidangId]
    );
    return rows;
  };

  const listKegiatan = async (subBidangId) => {
    const { rows } = await db.query(
      `
      SELECT id, full_code, uraian
      FROM kode_fungsi
      WHERE level = '3' AND parent_id = ${P(1)}
      ORDER BY full_code
    `,
      [subBidangId]
    );
    return rows;
  };

  return {
    listBkuRows,
    getBkuSummary,
    listBidang,
    listSubBidang,
    listKegiatan,
  };
}
