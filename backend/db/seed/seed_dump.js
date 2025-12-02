import pkg from 'pg';
const { Pool } = pkg;

// Database configuration
const dbConfig = {
  connectionString: process.env.DB_URL || 'postgresql://prpl_koma:password@localhost:5432/keuangan_desa',
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};

const pool = new Pool(dbConfig);

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('Starting database seeding...');
    
    // Begin transaction
    await client.query('BEGIN');
    
    // ========================
    // CLEANUP EXISTING DATA
    // ========================
    console.log('Cleaning up existing data...');
    
    // Delete in reverse order of dependencies (child tables first)
    await client.query('DELETE FROM buku_bank');
    await client.query('DELETE FROM buku_kas_pajak');
    await client.query('DELETE FROM buku_kas_pembantu');
    await client.query('DELETE FROM buku_kas_umum');
    await client.query('DELETE FROM rab_line');
    await client.query('DELETE FROM rab');
    await client.query('DELETE FROM rkk');
    await client.query('DELETE FROM rka_penarikan');
    await client.query('DELETE FROM rka');
    await client.query('DELETE FROM apbdes_rincian_penjabaran');
    await client.query('DELETE FROM apbdes_rincian');
    await client.query('DELETE FROM kegiatan');
    await client.query('DELETE FROM apbdes');
    await client.query('DELETE FROM users');
    await client.query('DELETE FROM kode_ekonomi');
    await client.query('DELETE FROM kode_fungsi');
    
    console.log('✅ Cleanup completed');
    
    // Reset sequences if any (not applicable here since using TEXT ids)
    // await client.query('ALTER SEQUENCE sequence_name RESTART WITH 1');
    
    // ========================
    // SEED REFERENCE TABLES
    // ========================
    
    // Seed kode_fungsi (Government Functions)
    console.log('Seeding kode_fungsi...');
    await client.query(`
      INSERT INTO kode_fungsi (id, full_code, uraian, level, parent_id) VALUES
      ('kf001', '1', 'URUSAN PEMERINTAHAN DESA', '1', NULL),
      ('kf002', '1.1', 'Penyelenggaraan Pemerintahan Desa', '2', 'kf001'),
      ('kf003', '1.1.01', 'Administrasi Pemerintahan Desa', '3', 'kf002'),
      ('kf004', '1.1.02', 'Administrasi Kependudukan', '3', 'kf002'),
      ('kf005', '1.1.03', 'Administrasi Pertanahan', '3', 'kf002'),
      ('kf006', '1.2', 'Pelaksanaan Pembangunan Desa', '2', 'kf001'),
      ('kf007', '1.2.01', 'Pembangunan Infrastruktur', '3', 'kf006'),
      ('kf008', '1.2.02', 'Pembangunan Sarana dan Prasarana', '3', 'kf006'),
      ('kf009', '2', 'PELAKSANAAN PEMBANGUNAN DESA', '1', NULL),
      ('kf010', '2.1', 'Bidang Infrastruktur dan Lingkungan', '2', 'kf009'),
      ('kf011', '2.1.01', 'Jalan Desa', '3', 'kf010'),
      ('kf012', '2.1.02', 'Jembatan Desa', '3', 'kf010'),
      ('kf013', '2.1.03', 'Air Bersih', '3', 'kf010'),
      ('kf014', '3', 'PEMBINAAN KEMASYARAKATAN', '1', NULL),
      ('kf015', '3.1', 'Ketenteraman dan Ketertiban', '2', 'kf014'),
      ('kf016', '3.2', 'Pemberdayaan Masyarakat', '2', 'kf014')
    `);
    
    // Seed kode_ekonomi (Economic Codes)
    console.log('Seeding kode_ekonomi...');
    await client.query(`
      INSERT INTO kode_ekonomi (id, full_code, uraian, level, parent_id) VALUES
      ('ke001', '4', 'BELANJA', '1', NULL),
      ('ke002', '4.1', 'BELANJA PEGAWAI', '2', 'ke001'),
      ('ke003', '4.1.1', 'Honorarium', '3', 'ke002'),
      ('ke004', '4.1.1.01', 'Honorarium Kepala Desa', '4', 'ke003'),
      ('ke005', '4.1.1.02', 'Honorarium Perangkat Desa', '4', 'ke003'),
      ('ke006', '4.1.1.03', 'Honorarium BPD', '4', 'ke003'),
      ('ke007', '4.1.1.04', 'Honorarium RT/RW', '4', 'ke003'),
      ('ke008', '4.1.2', 'Tunjangan', '3', 'ke002'),
      ('ke009', '4.1.2.01', 'Tunjangan Kepala Desa', '4', 'ke008'),
      ('ke010', '4.1.2.02', 'Tunjangan Perangkat Desa', '4', 'ke008'),
      ('ke011', '4.2', 'BELANJA BARANG DAN JASA', '2', 'ke001'),
      ('ke012', '4.2.1', 'Belanja Barang dan Jasa', '3', 'ke011'),
      ('ke013', '4.2.1.01', 'Alat Tulis Kantor', '4', 'ke012'),
      ('ke014', '4.2.1.02', 'Bahan Bakar', '4', 'ke012'),
      ('ke015', '4.2.1.03', 'Listrik dan Air', '4', 'ke012'),
      ('ke016', '4.2.1.04', 'Telepon dan Internet', '4', 'ke012'),
      ('ke017', '4.2.1.05', 'Konsumsi Rapat', '4', 'ke012'),
      ('ke018', '4.3', 'BELANJA MODAL', '2', 'ke001'),
      ('ke019', '4.3.1', 'Belanja Modal Tanah', '3', 'ke018'),
      ('ke020', '4.3.2', 'Belanja Modal Peralatan dan Mesin', '3', 'ke018'),
      ('ke021', '4.3.3', 'Belanja Modal Gedung dan Bangunan', '3', 'ke018'),
      ('ke022', '5', 'PEMBIAYAAN', '1', NULL),
      ('ke023', '5.1', 'PENERIMAAN PEMBIAYAAN', '2', 'ke022'),
      ('ke024', '5.2', 'PENGELUARAN PEMBIAYAAN', '2', 'ke022')
    `);
    
    // ========================
    // SEED USERS
    // ========================
    console.log('Seeding users...');
    await client.query(`
      INSERT INTO users (id, username, password_hash, full_name, role) VALUES
      ('user001', 'kades', '$2b$10$dummy.hash.for.demo.purposes.only', 'Budi Santoso', 'kades'),
      ('user002', 'sekdes', '$2b$10$dummy.hash.for.demo.purposes.only', 'Siti Aminah', 'sekretaris_desa'),
      ('user003', 'kaur_keuangan', '$2b$10$dummy.hash.for.demo.purposes.only', 'Ahmad Fauzi', 'kaur_keuangan'),
      ('user004', 'kasi_pem', '$2b$10$dummy.hash.for.demo.purposes.only', 'Diana Sari', 'kasi_pemerintahan'),
      ('user005', 'kasi_kesra', '$2b$10$dummy.hash.for.demo.purposes.only', 'Eko Prasetyo', 'kasi_kesejahteraan'),
      ('user006', 'kasi_pelayanan', '$2b$10$dummy.hash.for.demo.purposes.only', 'Fatimah', 'kasi_pelayanan'),
      ('user007', 'kaur_perencanaan', '$2b$10$dummy.hash.for.demo.purposes.only', 'Gunawan', 'kaur_perencanaan'),
      ('user008', 'kaur_tu', '$2b$10$dummy.hash.for.demo.purposes.only', 'Hesti Rahayu', 'kaur_tu_umum')
    `);
    
    // ========================
    // SEED APBDES DATA
    // ========================
    console.log('Seeding apbdes...');
    await client.query(`
      INSERT INTO apbdes (id, tahun, status) VALUES
      ('apb001', 2024, 'approved'),
      ('apb002', 2025, 'draft')
    `);
    
    // Seed kegiatan
    console.log('Seeding kegiatan...');
    await client.query(`
      INSERT INTO kegiatan (id, apbdes_id, nama, jenis) VALUES
      ('keg001', 'apb001', 'Penyelenggaraan Pemerintahan Desa', 'rutin'),
      ('keg002', 'apb001', 'Pembangunan Jalan Desa', 'pembangunan'),
      ('keg003', 'apb001', 'Pembangunan Air Bersih', 'pembangunan'),
      ('keg004', 'apb001', 'Pemberdayaan Masyarakat', 'pemberdayaan'),
      ('keg005', 'apb002', 'Renovasi Balai Desa', 'pembangunan'),
      ('keg006', 'apb002', 'Program Kesehatan Masyarakat', 'pemberdayaan')
    `);
    
    // Seed apbdes_rincian
    console.log('Seeding apbdes_rincian...');
    await client.query(`
      INSERT INTO apbdes_rincian (id, kegiatan_id, kode_fungsi_id, kode_ekonomi_id, uraian, jumlah_anggaran, sumber_dana) VALUES
      ('rin001', 'keg001', 'kf003', 'ke004', 'Honorarium Kepala Desa', 12000000.00, 'ADD'),
      ('rin002', 'keg001', 'kf003', 'ke005', 'Honorarium Perangkat Desa', 36000000.00, 'ADD'),
      ('rin003', 'keg001', 'kf003', 'ke013', 'Belanja Alat Tulis Kantor', 2500000.00, 'ADD'),
      ('rin004', 'keg002', 'kf011', 'ke021', 'Pembangunan Jalan Desa 500m', 75000000.00, 'DD'),
      ('rin005', 'keg003', 'kf013', 'ke021', 'Pembangunan Sumur Bor', 25000000.00, 'DD'),
      ('rin006', 'keg004', 'kf016', 'ke017', 'Pelatihan Keterampilan Masyarakat', 15000000.00, 'ADD'),
      ('rin007', 'keg005', 'kf007', 'ke021', 'Renovasi Balai Desa', 50000000.00, 'DD'),
      ('rin008', 'keg006', 'kf015', 'ke012', 'Program Posyandu', 8000000.00, 'ADD')
    `);
    
    // Seed apbdes_rincian_penjabaran
    console.log('Seeding apbdes_rincian_penjabaran...');
    await client.query(`
      INSERT INTO apbdes_rincian_penjabaran (id, rincian_id, uraian, volume, satuan, jumlah_anggaran, sumber_dana) VALUES
      ('penj001', 'rin001', 'Honorarium Kepala Desa per bulan', 12, 'bulan', 12000000.00, 'ADD'),
      ('penj002', 'rin002', 'Honorarium 3 Perangkat Desa per bulan', 36, 'orang-bulan', 36000000.00, 'ADD'),
      ('penj003', 'rin003', 'ATK untuk kebutuhan kantor desa', 1, 'paket', 2500000.00, 'ADD'),
      ('penj004', 'rin004', 'Material dan upah pembangunan jalan', 500, 'meter', 75000000.00, 'DD'),
      ('penj005', 'rin005', 'Pembuatan sumur bor lengkap dengan pompa', 1, 'unit', 25000000.00, 'DD'),
      ('penj006', 'rin006', 'Pelatihan menjahit dan kerajinan', 4, 'kali', 15000000.00, 'ADD'),
      ('penj007', 'rin007', 'Renovasi atap dan lantai balai desa', 1, 'unit', 50000000.00, 'DD'),
      ('penj008', 'rin008', 'Operasional posyandu 4 dusun', 12, 'bulan', 8000000.00, 'ADD')
    `);
    
    // ========================
    // SEED PLANNING DATA (RKA, RKK, RAB)
    // ========================
    console.log('Seeding rka...');
    await client.query(`
      INSERT INTO rka (id, kegiatan_id, uraian, jumlah) VALUES
      ('rka001', 'keg002', 'Pembangunan Jalan Desa Tahap 1', 75000000.00),
      ('rka002', 'keg003', 'Pembangunan Air Bersih', 25000000.00),
      ('rka003', 'keg004', 'Program Pemberdayaan Masyarakat', 15000000.00),
      ('rka004', 'keg005', 'Renovasi Balai Desa', 50000000.00)
    `);
    
    // Seed rka_penarikan
    console.log('Seeding rka_penarikan...');
    await client.query(`
      INSERT INTO rka_penarikan (id, rka_id, month, amount) VALUES
      ('rkap001', 'rka001', 3, 25000000.00),
      ('rkap002', 'rka001', 6, 25000000.00),
      ('rkap003', 'rka001', 9, 25000000.00),
      ('rkap004', 'rka002', 4, 12500000.00),
      ('rkap005', 'rka002', 8, 12500000.00),
      ('rkap006', 'rka003', 2, 5000000.00),
      ('rkap007', 'rka003', 5, 5000000.00),
      ('rkap008', 'rka003', 10, 5000000.00),
      ('rkap009', 'rka004', 7, 25000000.00),
      ('rkap010', 'rka004', 11, 25000000.00)
    `);
    
    // Seed rkk
    console.log('Seeding rkk...');
    await client.query(`
      INSERT INTO rkk (id, rka_id, bidang_fungsi_id, lokasi, volume, satuan, biaya_rkk, durasi_days, mulai, selesai, pelaksana) VALUES
      ('rkk001', 'rka001', 'kf011', 'Jalan Utama Desa RT 01', 500, 'meter', 75000000.00, 90, '2024-03-01', '2024-05-30', 'CV Karya Bersama'),
      ('rkk002', 'rka002', 'kf013', 'Dusun Mawar RT 02', 1, 'unit', 25000000.00, 30, '2024-04-01', '2024-04-30', 'CV Air Jernih'),
      ('rkk003', 'rka003', 'kf016', 'Balai Desa', 4, 'kali', 15000000.00, 120, '2024-02-01', '2024-05-31', 'Pokmas Maju Bersama'),
      ('rkk004', 'rka004', 'kf007', 'Balai Desa', 1, 'unit', 50000000.00, 60, '2024-07-01', '2024-08-30', 'CV Renovasi Jaya')
    `);
    
    // Seed rab
    console.log('Seeding rab...');
    await client.query(`
      INSERT INTO rab (id, rkk_id, rincian_id, kode_fungsi_id, kode_ekonomi_id, total_amount) VALUES
      ('rab001', 'rkk001', 'rin004', 'kf011', 'ke021', 75000000.00),
      ('rab002', 'rkk002', 'rin005', 'kf013', 'ke021', 25000000.00),
      ('rab003', 'rkk003', 'rin006', 'kf016', 'ke017', 15000000.00),
      ('rab004', 'rkk004', 'rin007', 'kf007', 'ke021', 50000000.00)
    `);
    
    // Seed rab_line
    console.log('Seeding rab_line...');
    await client.query(`
      INSERT INTO rab_line (id, rab_id, uraian, volume, harga_satuan, jumlah, kode_ekonomi_id) VALUES
      ('rabl001', 'rab001', 'Semen 40kg', 100, 75000.00, 7500000.00, 'ke021'),
      ('rabl002', 'rab001', 'Pasir per kubik', 50, 150000.00, 7500000.00, 'ke021'),
      ('rabl003', 'rab001', 'Kerikil per kubik', 50, 200000.00, 10000000.00, 'ke021'),
      ('rabl004', 'rab001', 'Upah tukang per hari', 300, 100000.00, 30000000.00, 'ke021'),
      ('rabl005', 'rab001', 'Upah buruh per hari', 400, 50000.00, 20000000.00, 'ke021'),
      ('rabl006', 'rab002', 'Pipa PVC 4 inch', 20, 150000.00, 3000000.00, 'ke021'),
      ('rabl007', 'rab002', 'Pompa air submersible', 1, 8000000.00, 8000000.00, 'ke021'),
      ('rabl008', 'rab002', 'Bor sumur per meter', 30, 300000.00, 9000000.00, 'ke021'),
      ('rabl009', 'rab002', 'Instalasi listrik', 1, 5000000.00, 5000000.00, 'ke021'),
      ('rabl010', 'rab003', 'Konsumsi pelatihan', 48, 25000.00, 1200000.00, 'ke017'),
      ('rabl011', 'rab003', 'Honorarium instruktur', 12, 500000.00, 6000000.00, 'ke017'),
      ('rabl012', 'rab003', 'Bahan pelatihan', 1, 7800000.00, 7800000.00, 'ke017'),
      ('rabl013', 'rab004', 'Genteng per buah', 500, 15000.00, 7500000.00, 'ke021'),
      ('rabl014', 'rab004', 'Keramik lantai per m2', 100, 150000.00, 15000000.00, 'ke021'),
      ('rabl015', 'rab004', 'Cat tembok', 20, 85000.00, 1700000.00, 'ke021'),
      ('rabl016', 'rab004', 'Upah tukang renovasi', 120, 120000.00, 14400000.00, 'ke021'),
      ('rabl017', 'rab004', 'Material lain-lain', 1, 11400000.00, 11400000.00, 'ke021')
    `);
    
    // ========================
    // SEED EXECUTION DATA (Buku Kas)
    // ========================
    console.log('Seeding buku_kas_umum...');
    await client.query(`
      INSERT INTO buku_kas_umum (id, tanggal, rab_id, kode_ekonomi_id, kode_fungsi_id, uraian, no_bukti, penerimaan, pengeluaran, saldo_after) VALUES
      ('bku001', '2024-01-01', NULL, 'ke023', 'kf001', 'Penerimaan ADD Tahap I', 'TRM001', 100000000.00, 0.00, 100000000.00),
      ('bku002', '2024-01-01', NULL, 'ke023', 'kf001', 'Penerimaan DD Tahap I', 'TRM002', 200000000.00, 0.00, 300000000.00),
      ('bku003', '2024-01-15', NULL, 'ke004', 'kf003', 'Bayar Honorarium Kepala Desa Januari', 'BKL001', 0.00, 1000000.00, 299000000.00),
      ('bku004', '2024-01-15', NULL, 'ke005', 'kf003', 'Bayar Honorarium Perangkat Desa Januari', 'BKL002', 0.00, 3000000.00, 296000000.00),
      ('bku005', '2024-02-01', NULL, 'ke013', 'kf003', 'Belanja ATK Februari', 'BKL003', 0.00, 500000.00, 295500000.00),
      ('bku006', '2024-03-01', 'rab001', 'ke021', 'kf011', 'Pembayaran Material Jalan Tahap 1', 'BKL004', 0.00, 25000000.00, 270500000.00),
      ('bku007', '2024-04-01', 'rab002', 'ke021', 'kf013', 'Pembayaran Bor Sumur', 'BKL005', 0.00, 12500000.00, 258000000.00),
      ('bku008', '2024-04-01', NULL, 'ke023', 'kf001', 'Penerimaan ADD Tahap II', 'TRM003', 100000000.00, 0.00, 358000000.00),
      ('bku009', '2024-05-01', 'rab003', 'ke017', 'kf016', 'Pembayaran Pelatihan Masyarakat', 'BKL006', 0.00, 5000000.00, 353000000.00),
      ('bku010', '2024-06-01', 'rab001', 'ke021', 'kf011', 'Pembayaran Upah Jalan Tahap 2', 'BKL007', 0.00, 25000000.00, 328000000.00)
    `);
    
    // Seed buku_kas_pembantu
    console.log('Seeding buku_kas_pembantu...');
    await client.query(`
      INSERT INTO buku_kas_pembantu (id, bku_id, type_enum, tanggal, uraian, penerimaan, pengeluaran, saldo_after) VALUES
      ('bkp001', 'bku003', 'honorarium', '2024-01-15', 'Honorarium Kepala Desa Januari', 0.00, 1000000.00, 1000000.00),
      ('bkp002', 'bku004', 'honorarium', '2024-01-15', 'Honorarium Perangkat Desa Januari', 0.00, 3000000.00, 4000000.00),
      ('bkp003', 'bku005', 'operasional', '2024-02-01', 'ATK untuk kantor desa', 0.00, 500000.00, 4500000.00),
      ('bkp004', 'bku006', 'pembangunan', '2024-03-01', 'Material pembangunan jalan', 0.00, 25000000.00, 29500000.00),
      ('bkp005', 'bku007', 'pembangunan', '2024-04-01', 'Biaya pembuatan sumur bor', 0.00, 12500000.00, 42000000.00),
      ('bkp006', 'bku009', 'pemberdayaan', '2024-05-01', 'Biaya pelatihan masyarakat', 0.00, 5000000.00, 47000000.00),
      ('bkp007', 'bku010', 'pembangunan', '2024-06-01', 'Upah pembangunan jalan', 0.00, 25000000.00, 72000000.00)
    `);
    
    // Seed buku_kas_pajak
    console.log('Seeding buku_kas_pajak...');
    await client.query(`
      INSERT INTO buku_kas_pajak (id, tanggal, uraian, pemotongan, penyetoran, saldo_after) VALUES
      ('bkpj001', '2024-01-15', 'PPh 21 Honorarium Januari', 150000.00, 0.00, 150000.00),
      ('bkpj002', '2024-02-10', 'Setor PPh 21 Januari', 0.00, 150000.00, 0.00),
      ('bkpj003', '2024-02-15', 'PPh 21 Honorarium Februari', 150000.00, 0.00, 150000.00),
      ('bkpj004', '2024-03-10', 'Setor PPh 21 Februari', 0.00, 150000.00, 0.00),
      ('bkpj005', '2024-03-15', 'PPh 23 Jasa Konstruksi', 1250000.00, 0.00, 1250000.00),
      ('bkpj006', '2024-04-10', 'Setor PPh 23 Maret', 0.00, 1250000.00, 0.00),
      ('bkpj007', '2024-04-15', 'PPh 21 Honorarium April', 150000.00, 0.00, 150000.00),
      ('bkpj008', '2024-05-10', 'Setor PPh 21 April', 0.00, 150000.00, 0.00)
    `);
    
    // Seed buku_bank
    console.log('Seeding buku_bank...');
    await client.query(`
      INSERT INTO buku_bank (id, tanggal, uraian, bukti_transaksi, setoran, penerimaan_bunga, penarikan, pajak, biaya_admin, saldo_after) VALUES
      ('bb001', '2024-01-01', 'Saldo Awal Tahun', 'SA2024', 0.00, 0.00, 0.00, 0.00, 0.00, 50000000.00),
      ('bb002', '2024-01-02', 'Transfer ADD Tahap I', 'TF001', 100000000.00, 0.00, 0.00, 0.00, 2500.00, 149997500.00),
      ('bb003', '2024-01-03', 'Transfer DD Tahap I', 'TF002', 200000000.00, 0.00, 0.00, 0.00, 2500.00, 349995000.00),
      ('bb004', '2024-01-15', 'Tarik untuk Operasional', 'TK001', 0.00, 0.00, 10000000.00, 0.00, 5000.00, 339990000.00),
      ('bb005', '2024-02-01', 'Bunga Bank Januari', 'BG001', 0.00, 425000.00, 0.00, 0.00, 0.00, 340415000.00),
      ('bb006', '2024-02-10', 'Tarik untuk Pembangunan', 'TK002', 0.00, 0.00, 50000000.00, 0.00, 5000.00, 290410000.00),
      ('bb007', '2024-03-01', 'Bunga Bank Februari', 'BG002', 0.00, 363000.00, 0.00, 0.00, 0.00, 290773000.00),
      ('bb008', '2024-04-01', 'Transfer ADD Tahap II', 'TF003', 100000000.00, 0.00, 0.00, 0.00, 2500.00, 390770500.00),
      ('bb009', '2024-04-01', 'Bunga Bank Maret', 'BG003', 0.00, 364000.00, 0.00, 0.00, 0.00, 391134500.00),
      ('bb010', '2024-04-15', 'Tarik untuk Pelatihan', 'TK003', 0.00, 0.00, 15000000.00, 0.00, 5000.00, 376129500.00)
    `);
    
    // Commit transaction
    await client.query('COMMIT');
    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    console.log('\n📊 Seeding Summary:');
    console.log('- kode_fungsi: 16 records');
    console.log('- kode_ekonomi: 24 records');
    console.log('- users: 8 records');
    console.log('- apbdes: 2 records');
    console.log('- kegiatan: 6 records');
    console.log('- apbdes_rincian: 8 records');
    console.log('- apbdes_rincian_penjabaran: 8 records');
    console.log('- rka: 4 records');
    console.log('- rka_penarikan: 10 records');
    console.log('- rkk: 4 records');
    console.log('- rab: 4 records');
    console.log('- rab_line: 17 records');
    console.log('- buku_kas_umum: 10 records');
    console.log('- buku_kas_pembantu: 7 records');
    console.log('- buku_kas_pajak: 8 records');
    console.log('- buku_bank: 10 records');
    console.log('\n🎉 All tables have been populated with sample data!');
    
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    console.log('🌱 Starting database seeding process...');
    console.log('📅 Date:', new Date().toISOString());
    
    // Test database connection
    const testClient = await pool.connect();
    await testClient.query('SELECT 1');
    testClient.release();
    console.log('✅ Database connection successful');
    
    // Run seeding
    await seedDatabase();
    
  } catch (error) {
    console.error('💥 Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('🔌 Database connection closed');
  }
}

// Run the main function
main();

export { seedDatabase };
