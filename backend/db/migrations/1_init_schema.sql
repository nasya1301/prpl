-- =========================
-- DROP (for clean re-run)
-- =========================
DROP TABLE IF EXISTS 
    buku_bank,
    buku_kas_pajak,
    buku_kas_pembantu,
    buku_kas_umum,
    rab_line,
    rab,
    rkk,
    rka_penarikan,
    rka,
    apbdes_rincian_penjabaran,
    apbdes_rincian,
    kegiatan,
    apbdes,
    kode_fungsi,
    kode_ekonomi
CASCADE;

-- =========================
-- REFERENCE TABLES
-- =========================

CREATE TABLE kode_fungsi (
    id TEXT PRIMARY KEY,
    full_code TEXT NOT NULL,
    uraian TEXT NOT NULL,
    level TEXT NOT NULL,
    parent_id TEXT REFERENCES kode_fungsi(id) ON DELETE SET NULL
);

CREATE TABLE kode_ekonomi (
    id TEXT PRIMARY KEY,
    full_code TEXT NOT NULL,
    uraian TEXT NOT NULL,
    level TEXT NOT NULL,
    parent_id TEXT REFERENCES kode_ekonomi(id) ON DELETE SET NULL
);

-- =========================
-- APBDES (Induk + Penjabaran)
-- =========================

CREATE TABLE apbdes (
    id TEXT PRIMARY KEY,
    tahun INTEGER NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE kegiatan (
    id TEXT PRIMARY KEY,
    apbdes_id TEXT NOT NULL REFERENCES apbdes(id) ON DELETE CASCADE,
    nama TEXT NOT NULL,
    jenis TEXT NOT NULL
);

CREATE TABLE apbdes_rincian (
    id TEXT PRIMARY KEY,
    kegiatan_id TEXT NOT NULL REFERENCES kegiatan(id) ON DELETE CASCADE,
    kode_fungsi_id TEXT REFERENCES kode_fungsi(id),
    kode_ekonomi_id TEXT REFERENCES kode_ekonomi(id),
    uraian TEXT NOT NULL,
    jumlah_anggaran NUMERIC(18,2) NOT NULL,
    sumber_dana TEXT
);

CREATE TABLE apbdes_rincian_penjabaran (
    id TEXT PRIMARY KEY,
    rincian_id TEXT NOT NULL REFERENCES apbdes_rincian(id) ON DELETE CASCADE,
    uraian TEXT NOT NULL,
    volume NUMERIC(18,2),
    satuan TEXT,
    jumlah_anggaran NUMERIC(18,2) NOT NULL,
    sumber_dana TEXT
);

-- =========================
-- PLANNING (RKA, RKK, RAB)
-- =========================

CREATE TABLE rka (
    id TEXT PRIMARY KEY,
    kegiatan_id TEXT NOT NULL REFERENCES kegiatan(id) ON DELETE CASCADE,
    uraian TEXT NOT NULL,
    jumlah NUMERIC(18,2) NOT NULL
);

CREATE TABLE rka_penarikan (
    id TEXT PRIMARY KEY,
    rka_id TEXT NOT NULL REFERENCES rka(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    amount NUMERIC(18,2) NOT NULL
);

CREATE TABLE rkk (
    id TEXT PRIMARY KEY,
    rka_id TEXT NOT NULL REFERENCES rka(id) ON DELETE CASCADE,
    bidang_fungsi_id TEXT REFERENCES kode_fungsi(id),
    lokasi TEXT,
    volume NUMERIC(18,2),
    satuan TEXT,
    biaya_rkk NUMERIC(18,2),
    durasi_days INTEGER,
    mulai DATE,
    selesai DATE,
    pelaksana TEXT
);

CREATE TABLE rab (
    id TEXT PRIMARY KEY,
    rkk_id TEXT NOT NULL REFERENCES rkk(id) ON DELETE CASCADE,
    rincian_id TEXT REFERENCES apbdes_rincian(id),
    kode_fungsi_id TEXT REFERENCES kode_fungsi(id),
    kode_ekonomi_id TEXT REFERENCES kode_ekonomi(id),
    total_amount NUMERIC(18,2) NOT NULL
);

CREATE TABLE rab_line (
    id TEXT PRIMARY KEY,
    rab_id TEXT NOT NULL REFERENCES rab(id) ON DELETE CASCADE,
    uraian TEXT NOT NULL,
    volume NUMERIC(18,2),
    harga_satuan NUMERIC(18,2),
    jumlah NUMERIC(18,2),
    kode_ekonomi_id TEXT REFERENCES kode_ekonomi(id)
);

-- =========================
-- EXECUTION (BKU & Pembantu)
-- =========================

CREATE TABLE buku_kas_umum (
    id TEXT PRIMARY KEY,
    tanggal DATE NOT NULL,
    rab_id TEXT REFERENCES rab(id),
    kode_ekonomi_id TEXT REFERENCES kode_ekonomi(id),
    kode_fungsi_id TEXT REFERENCES kode_fungsi(id),
    uraian TEXT,
    no_bukti TEXT,
    penerimaan NUMERIC(18,2) DEFAULT 0,
    pengeluaran NUMERIC(18,2) DEFAULT 0,
    saldo_after NUMERIC(18,2) DEFAULT 0
);

CREATE TABLE buku_kas_pembantu (
    id TEXT PRIMARY KEY,
    bku_id TEXT NOT NULL REFERENCES buku_kas_umum(id) ON DELETE CASCADE,
    type_enum TEXT,
    tanggal DATE NOT NULL,
    uraian TEXT,
    penerimaan NUMERIC(18,2) DEFAULT 0,
    pengeluaran NUMERIC(18,2) DEFAULT 0,
    saldo_after NUMERIC(18,2) DEFAULT 0
);

CREATE TABLE buku_kas_pajak (
    id TEXT PRIMARY KEY,
    tanggal DATE NOT NULL,
    uraian TEXT,
    pemotongan NUMERIC(18,2) DEFAULT 0,
    penyetoran NUMERIC(18,2) DEFAULT 0,
    saldo_after NUMERIC(18,2) DEFAULT 0
);

CREATE TABLE buku_bank (
    id TEXT PRIMARY KEY,
    tanggal DATE NOT NULL,
    uraian TEXT,
    bukti_transaksi TEXT,
    setoran NUMERIC(18,2) DEFAULT 0,
    penerimaan_bunga NUMERIC(18,2) DEFAULT 0,
    penarikan NUMERIC(18,2) DEFAULT 0,
    pajak NUMERIC(18,2) DEFAULT 0,
    biaya_admin NUMERIC(18,2) DEFAULT 0,
    saldo_after NUMERIC(18,2) DEFAULT 0
);

CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (
    role IN (
      'sekretaris_desa',
      'kaur_keuangan',
      'kasi_pemerintahan',
      'kasi_kesejahteraan',
      'kasi_pelayanan',
      'kaur_perencanaan',
      'kaur_tu_umum',
      'kepala_desa'
    )
  )
);


CREATE TABLE IF NOT EXISTS refresh_tokens (
    refresh_token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    expiry TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
