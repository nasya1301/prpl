// src/repository/apbd/apbd.repo.js
export default function createApbdRepo(arg) {
  const db =
    arg?.query || arg?.connect || arg?.db?.query
      ? arg.query
        ? arg
        : arg.db
      : undefined;

  if (!db || typeof db.query !== "function") {
    console.error("[apbd.repo] Invalid db instance received:", arg);
    throw new Error("Invalid database instance passed to createApbdRepo");
  }

  async function listApbdesRows({ id, tahun, status }) {
    const conditions = [];
    const values = [];
    let idx = 1;

    // Join apbdes_rincian with kegiatan and apbdes to allow filtering by tahun/status
    if (id) {
      conditions.push(`r.id = $${idx++}`);
      values.push(id);
    }
    if (tahun) {
      conditions.push(`a.tahun = $${idx++}`);
      values.push(tahun);
    }
    if (status) {
      conditions.push(`a.status = $${idx++}`);
      values.push(status);
    }

    const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const q = `
      SELECT
        r.id,
        a.id AS apbdes_id,
        a.tahun,
        a.status,
        r.kode_fungsi_id,
        r.kode_ekonomi_id,
        r.jumlah_anggaran,
        r.sumber_dana
      FROM apbdes_rincian r
      LEFT JOIN apbdes a ON a.id = r.apbdes_id
      ${where}
      ORDER BY a.tahun DESC, r.id
    `;

    const { rows } = await db.query(q, values);
    return rows;
  }

  const listBidang = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_fungsi WHERE level = $1 ORDER BY full_code`,
      ["bidang"]
    );
    return rows;
  };

  const listSubBidang = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_fungsi WHERE level = $1 ORDER BY full_code`,
      ["sub_bidang"]
    );
    return rows;
  };

  const listKegiatan = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_fungsi WHERE level = $1 ORDER BY full_code`,
      ["kegiatan"]
    );
    return rows;
  };

  const listKodeEkonomi = async () => {
    const { rows } = await db.query(`
      SELECT id, full_code, uraian, level, parent_id
      FROM kode_ekonomi 
      ORDER BY full_code
    `);
    return rows;
  };

  const listAkun = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_ekonomi WHERE level = 'akun' ORDER BY full_code`
    );
    return rows;
  };

  const listKodeFungsi = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, level, parent_id FROM kode_fungsi ORDER BY full_code`
    );
    return rows;
  };

  const listKelompok = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_ekonomi WHERE level = $1 ORDER BY full_code`,
      ["kelompok"]
    );
    return rows;
  };

  const listJenis = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_ekonomi WHERE level = $1 ORDER BY full_code`,
      ["jenis"]
    );
    return rows;
  };

  const listObjek = async () => {
    const { rows } = await db.query(
      `SELECT id, full_code, uraian, parent_id FROM kode_ekonomi WHERE level = $1 ORDER BY full_code`,
      ["objek"]
    );
    return rows;
  };

  // Helper function to generate sequential ID with retry on conflict
  const generateSequentialId = async (prefix, tableName, columnName = 'id', maxRetries = 5) => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Get the maximum number used with this prefix
      const q = `
        SELECT ${columnName} 
        FROM ${tableName} 
        WHERE ${columnName} ~ $1
        ORDER BY ${columnName} DESC 
        LIMIT 1
      `;
      // Regex pattern to match prefix followed by digits: ^prefix\d+$
      const { rows } = await db.query(q, [`^${prefix}\\d+$`]);
      
      let nextNumber = 1;
      if (rows.length > 0 && rows[0][columnName]) {
        // Extract number from last ID (e.g., "apbdes001" -> 1)
        const lastId = rows[0][columnName];
        const match = lastId.match(new RegExp(`${prefix}(\\d+)$`));
        if (match) {
          nextNumber = parseInt(match[1], 10) + 1;
        }
      }
      
      // Format with leading zeros (001, 002, etc.)
      const formattedNumber = String(nextNumber).padStart(3, '0');
      const newId = `${prefix}${formattedNumber}`;
      
      // Check if this ID already exists
      const checkQ = `SELECT 1 FROM ${tableName} WHERE ${columnName} = $1`;
      const { rows: existingRows } = await db.query(checkQ, [newId]);
      
      if (existingRows.length === 0) {
        return newId;
      }
      
      // If ID exists, wait a bit and retry
      await new Promise(resolve => setTimeout(resolve, 10 * (attempt + 1)));
    }
    
    // Fallback to timestamp-based ID if all retries fail
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createApbdesDraft = async (tahun) => {
    const id = await generateSequentialId('apbdes', 'apbdes');
    const q = `
      INSERT INTO apbdes (id, tahun, status)
      VALUES ($1, $2, 'draft')
      RETURNING *;
    `;
    const { rows } = await db.query(q, [id, tahun]);
    return rows[0];
  };

  const getDraftApbdesByYear = async (tahun) => {
    const q = `SELECT * FROM apbdes WHERE tahun = $1 AND status = 'draft' LIMIT 1`;
    const { rows } = await db.query(q, [tahun]);
    return rows[0];
  };

  const createApbdesRincian = async (payload) => {
    const id = await generateSequentialId('rincian', 'apbdes_rincian');
    const q = `
      INSERT INTO apbdes_rincian (
        id, kode_fungsi_id, kode_ekonomi_id, jumlah_anggaran, sumber_dana, apbdes_id
      ) VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *;
    `;

    const params = [
      id,
      payload.kode_fungsi_id || null,
      payload.kode_ekonomi_id || null,
      payload.jumlah_anggaran,
      payload.sumber_dana || null,
      payload.apbdes_id || null,
    ];

    const { rows } = await db.query(q, params);
    return rows[0];
  };

  const getDraftApbdesList = async () => {
    const q = `
      SELECT r.id, a.id AS apbdes_id, a.tahun, a.status,
             r.kode_fungsi_id, r.kode_ekonomi_id, r.jumlah_anggaran, r.sumber_dana  
      FROM apbdes_rincian r
      JOIN apbdes a ON a.id = r.apbdes_id
      WHERE a.status = $1
      ORDER BY a.tahun DESC, r.id
    `;
    const { rows } = await db.query(q, ["draft"]);
    return rows;
  };

  const getDraftApbdesById = async (id) => {
    const q = `
      SELECT r.id, a.id AS apbdes_id, a.tahun, a.status,
             r.kode_fungsi_id, r.kode_ekonomi_id, r.jumlah_anggaran, r.sumber_dana
      FROM apbdes_rincian r
      JOIN apbdes a ON a.id = r.apbdes_id
      WHERE r.id = $1
      ORDER BY r.id
    `;
    const { rows } = await db.query(q, [id]);
    return rows[0];
  };

  const getDraftApbdesSummary = async () => {
    const q = `
      SELECT e.uraian, SUM(r.jumlah_anggaran) AS total_anggaran
      FROM apbdes_rincian r
      JOIN kode_ekonomi e ON e.id = r.kode_ekonomi_id
      JOIN apbdes a ON a.id = r.apbdes_id
      WHERE e.level = 'akun' AND a.status = $1
      GROUP BY e.uraian
    `;
    const { rows } = await db.query(q, ["draft"]);
    const result = rows.reduce((acc, cur) => {
      acc[cur.uraian] = parseFloat(cur.total_anggaran) || 0;
      return acc;
    }, {});
    return result;
  };

  const updateDraftApbdesItem = async (id, data) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of [
      "kode_fungsi_id",
      "kode_ekonomi_id",
      "jumlah_anggaran",
      "sumber_dana",
    ]) {
      // Only include if the value exists and is not null/undefined
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (!fields.length) {
      // If no fields to update, just return the existing record
      return getDraftApbdesById(id);
    }

    const q = `
      UPDATE apbdes_rincian
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
    `;
    values.push(id);
    const { rows } = await db.query(q, values);
    return rows[0];
  };

  const deleteDraftApbdesItem = async (id) => {
    const q = `
      DELETE FROM apbdes_rincian
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(q, [id]);
    return rows[0];
  };

  const postDraftApbdes = async (id) => {
    const q = `
      UPDATE apbdes
      SET status = 'posted'
      WHERE id = $1
    `;
    await db.query(q, [id]);
  };

  const recalculateDraftApbdesTotals = async (apbdesId) => {
    const q = `
      SELECT e.uraian, SUM(r.jumlah_anggaran) AS total
      FROM apbdes_rincian r
      JOIN kode_ekonomi e ON e.id = r.kode_ekonomi_id
      WHERE r.apbdes_id = $1
      GROUP BY e.uraian
    `;
    const { rows } = await db.query(q, [apbdesId]);
    return rows;
  };

  const createApbdesRincianPenjabaran = async (payload) => {
    const id = await generateSequentialId('penjabaran', 'apbdes_rincian_penjabaran');
    const q = `
      INSERT INTO apbdes_rincian_penjabaran
      (id, rincian_id, kode_fungsi_id, kode_ekonomi_id, volume, satuan, jumlah_anggaran, sumber_dana)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) 
      RETURNING *;
    `;

    const params = [
      id,
      payload.rincian_id,
      payload.kode_fungsi_id || null,
      payload.kode_ekonomi_id || null,
      payload.volume || null,
      payload.satuan || null,
      payload.jumlah_anggaran,
      payload.sumber_dana || null,
    ];

    const { rows } = await db.query(q, params);
    return rows[0];
  };

  const getApbdesIdByRincianId = async (rincianId) => {
    const q = `
      SELECT r.apbdes_id 
      FROM apbdes_rincian r 
      WHERE r.id = $1
    `;
    const { rows } = await db.query(q, [rincianId]);
    return rows[0]?.apbdes_id || null;
  };

  const getDraftPenjabaranApbdesList = async () => {
    const q = `
      SELECT p.id, p.rincian_id, p.volume, p.satuan, p.jumlah_anggaran, p.sumber_dana
      FROM apbdes_rincian_penjabaran p
      JOIN apbdes_rincian r ON p.rincian_id = r.id
      ORDER BY p.id
    `;
    const { rows } = await db.query(q);
    return rows;
  };

  const getDraftPenjabaranApbdesById = async (id) => {
    const q = `
      SELECT id AS penjabaran_id, rincian_id, volume, satuan, jumlah_anggaran, sumber_dana
      FROM apbdes_rincian_penjabaran
      WHERE id = $1
      ORDER BY id
    `;
    const { rows } = await db.query(q, [id]);
    return rows;
  };

  const getDraftPenjabaranApbdesSummary = async () => {
    const q = `
      SELECT e.uraian, SUM(p.jumlah_anggaran) AS total_anggaran
      FROM apbdes_rincian_penjabaran p
      JOIN kode_ekonomi e ON e.id = p.kode_ekonomi_id
      JOIN apbdes a ON a.id = (SELECT r.apbdes_id FROM apbdes_rincian r WHERE r.id = p.rincian_id)
      WHERE e.level = 'akun' AND a.status = $1
      GROUP BY e.uraian
    `;
    const { rows } = await db.query(q, ["draft"]);
    const result = rows.reduce((acc, cur) => {
      acc[cur.uraian] = parseFloat(cur.total_anggaran) || 0;
      return acc;
    }, {});
    return result;
  };

  const postDraftPenjabaranApbdes = async (id) => {
    const q = `
      UPDATE apbdes_rincian_penjabaran
      SET status = 'posted'
      WHERE id = $1
    `;
    await db.query(q, [id]);
  };

  const generateDraftApbdes = async (apbdesId) => {
    // Implementasi pembuatan laporan APBDes berdasarkan apbdesId
    // Misalnya, mengumpulkan data terkait dan menyusunnya dalam format tertentu
  };

  const downloadDraftApbdes = async (apbdesId) => {
    const report = await generateDraftApbdes(apbdesId);
    // Implementasi pengunduhan laporan, misalnya mengirimkan file sebagai respons
  };

  const getApbdesStatus = async (id) => {
    const q = `
      SELECT id AS apbdes_id, status AS apbdes_status
      FROM apbdes
      WHERE id = $1
    `;
    const { rows } = await db.query(q, [id]);
    return rows[0]?.apbdes_status || null;
  };

  const updatePenjabaranApbdesItem = async (id, data) => {
    const fields = [];
    const values = [];
    let i = 1;

    for (const key of [
      "kode_fungsi_id",
      "kode_ekonomi_id",
      "volume",
      "satuan",
      "jumlah_anggaran",
      "sumber_dana",
    ]) {
      // Only include if the value exists and is not null/undefined
      if (data[key] !== undefined && data[key] !== null && data[key] !== "") {
        fields.push(`${key} = $${i}`);
        values.push(data[key]);
        i++;
      }
    }

    if (!fields.length) {
      // If no fields to update, just return the existing record
      return getDraftPenjabaranApbdesById(id).then(rows => rows[0]);
    }

    const q = `
      UPDATE apbdes_rincian_penjabaran
      SET ${fields.join(", ")}
      WHERE id = $${i}
      RETURNING *;
    `;
    values.push(id);
    const { rows } = await db.query(q, values);
    return rows[0];
  };

  const deletePenjabaranApbdesItem = async (id) => {
    const q = `
      DELETE FROM apbdes_rincian_penjabaran
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await db.query(q, [id]);
    return rows[0];
  };

  /*
  const recalculatePenjabaranApbdesTotals = async (apbdesId) => {
    const q = `
      SELECT e.uraian, SUM(p.jumlah_anggaran) AS total_anggaran
      FROM apbdes_rincian_penjabaran p
      JOIN apbdes_rincian r ON p.rincian_id = r.id
      JOIN kode_ekonomi e ON e.id = r.kode_ekonomi_id
      JOIN apbdes a ON a.id = (SELECT r.apbdes_id FROM apbdes_rincian r WHERE r.id = p.rincian_id)
      WHERE e.level = 'akun'
        AND a.status = $1
        ${apbdesId ? "AND a.id = $2" : ""}
      GROUP BY e.uraian
  `;
    const params = apbdesId ? ["draft", apbdesId] : ["draft"];
    const { rows } = await db.query(q, params);
    const result = rows.reduce((acc, cur) => {
      acc[cur.uraian] = parseFloat(cur.total_anggaran) || 0;
      return acc;
    }, {});
    return result;
  };*/

  const getKodeFungsiDetailsByFullCode = async (fullCode) => {
    const parts = fullCode.split(" ");
    let bidang, subBidang, kegiatan;

    if (parts.length >= 1) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_fungsi WHERE full_code = $1 AND level = 'bidang'`,
        [parts[0]]
      );
      bidang = rows[0];
    }
    if (parts.length >= 2) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_fungsi WHERE full_code = $1 AND level = 'sub_bidang'`,
        [`${parts[0]} ${parts[1]}`]
      );
      subBidang = rows[0];
    }
    if (parts.length >= 3) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_fungsi WHERE full_code = $1 AND level = 'kegiatan'`,
        [`${parts[0]} ${parts[1]} ${parts[2]}`]
      );
      kegiatan = rows[0];
    }

    return { bidang, subBidang, kegiatan };
  };

  const getKodeEkonomiDetailsByFullCode = async (fullCode) => {
    const parts = fullCode.split(" ");
    let akun, kelompok, jenis, objek;

    if (parts.length >= 1) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_ekonomi WHERE full_code = $1 AND level = 'akun'`,
        [parts[0]]
      );
      akun = rows[0];
    }
    if (parts.length >= 2) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_ekonomi WHERE full_code = $1 AND level = 'kelompok'`,
        [`${parts[0]} ${parts[1]}`]
      );
      kelompok = rows[0];
    }
    if (parts.length >= 3) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_ekonomi WHERE full_code = $1 AND level = 'jenis'`,
        [`${parts[0]} ${parts[1]} ${parts[2]}`]
      );
      jenis = rows[0];
    }
    if (parts.length >= 4) {
      const { rows } = await db.query(
        `SELECT id, uraian FROM kode_ekonomi WHERE full_code = $1 AND level = 'objek'`,
        [`${parts[0]} ${parts[1]} ${parts[2]} ${parts[3]}`]
      );
      objek = rows[0];
    }

    return { akun, kelompok, jenis, objek };
  };

  // Helper: Convert full_code (spasi) ke id (titik)
  const getIdByFullCode = async (fullCode, tableName) => {
    if (!fullCode) return null;
    
    // Normalize: bisa terima "5 3 2 01" atau "5.3.2.01"
    const normalized = fullCode.trim().replace(/\s+/g, ' ');
    
    const q = `
      SELECT id FROM ${tableName}
      WHERE full_code = $1
      LIMIT 1
    `;
    
    const { rows } = await db.query(q, [normalized]);
    return rows[0]?.id || null;
  };

  const getKodeEkonomiIdByFullCode = async (fullCode) => {
    return getIdByFullCode(fullCode, 'kode_ekonomi');
  };

  const getKodeFungsiIdByFullCode = async (fullCode) => {
    return getIdByFullCode(fullCode, 'kode_fungsi');
  };

  return {
    //tabel apbdes
    createApbdesDraft,
    getDraftApbdesByYear,

    //input form apbdes rincian
    listKodeFungsi,
    listBidang,
    listSubBidang,
    listKegiatan,
    listKodeEkonomi,
    listAkun,
    listKelompok,
    listJenis,
    listObjek,
    createApbdesRincian,

    //output apbdes rincian
    getDraftApbdesList,
    getDraftApbdesById,
    getDraftApbdesSummary,
    updateDraftApbdesItem,
    deleteDraftApbdesItem,
    recalculateDraftApbdesTotals,
    downloadDraftApbdes,
    postDraftApbdes,

    //input form apbdes rincian penjabaran
    createApbdesRincianPenjabaran,
    getApbdesIdByRincianId,

    //output draft apbdes rincian penjabaran
    getDraftPenjabaranApbdesList,
    getDraftPenjabaranApbdesById,
    getDraftPenjabaranApbdesSummary,
    updatePenjabaranApbdesItem,
    deletePenjabaranApbdesItem,
    //recalculatePenjabaranApbdesTotals,
    postDraftPenjabaranApbdes,

    //buku apbdes
    listApbdesRows,
    getApbdesStatus,

    //dropdown helper
    getKodeFungsiDetailsByFullCode,
    getKodeEkonomiDetailsByFullCode,
    getKodeEkonomiIdByFullCode,
    getKodeFungsiIdByFullCode,
  };
}
