BEGIN;

-- =========================
-- SEED: kode_fungsi
-- =========================

INSERT INTO kode_fungsi (id, full_code, uraian, level, parent_id) VALUES
-- BIDANG 1: PENYELENGGARAAN PEMERINTAHAN DESA
('1', '1', 'BIDANG PENYELENGGARAAN PEMERINTAHAN DESA', 'bidang', NULL),

-- SUB BIDANG 1.1
('1.1', '1 1', 'Sub Bidang Penyelenggaraan Belanja Penghasilan Tetap, Tunjangan dan Operasional Pemerintahan Desa (Maksimal 30% untuk kegiatan 1-7)', 'sub_bidang', '1'),
('1.1.01', '1 1 01', 'Penyediaan Penghasilan Tetap dan Tunjangan Kepala Desa', 'kegiatan', '1.1'),
('1.1.02', '1 1 02', 'Penyediaan Penghasilan Tetap dan Tunjangan Perangkat Desa', 'kegiatan', '1.1'),
('1.1.03', '1 1 03', 'Penyediaan Jaminan Sosial bagi Kepala Desa dan Perangkat Desa', 'kegiatan', '1.1'),
('1.1.04', '1 1 04', 'Penyediaan Operasional Pemerintah Desa (ATK, Honorarium PKPKD dan PPKD, perlengkapan perkantoran, pakaian dinas/atribut, listrik/telpon, dll)', 'kegiatan', '1.1'),
('1.1.05', '1 1 05', 'Penyediaan Tunjangan BPD', 'kegiatan', '1.1'),
('1.1.06', '1 1 06', 'Penyediaan Operasional BPD (Rapat-rapat (ATK, makan-minum), perlengkapan perkantoran, Pakaian Seragam, perjalanan dinas, listrik/telpon, dll)', 'kegiatan', '1.1'),
('1.1.07', '1 1 07', 'Penyediaan Insentif/Operasional RT/RW', 'kegiatan', '1.1'),
('1.1.90', '1 1 90-99', 'Lain-lain Sub Bidang Penyelenggaraan Belanja Penghasilan Tetap, Tunjangan dan Operasional Pemerintahan Desa', 'kegiatan', '1.1'),

-- SUB BIDANG 1.2
('1.2', '1 2', 'Sub Bidang Sarana dan Prasarana Pemerintahan Desa', 'sub_bidang', '1'),
('1.2.01', '1 2 01', 'Penyediaan sarana (aset tetap) perkantoran/pemerintahan', 'kegiatan', '1.2'),
('1.2.02', '1 2 02', 'Pemeliharaan Gedung/Prasarana Kantor Desa', 'kegiatan', '1.2'),
('1.2.03', '1 2 03', 'Pembangunan/Rehabilitasi/Peningkatan Gedung/Prasarana Kantor Desa**', 'kegiatan', '1.2'),
('1.2.90', '1 2 90-99', 'lain-lain kegiatan sub bidang sarana dan prasarana pemerintahan Desa*', 'kegiatan', '1.2'),

-- SUB BIDANG 1.3
('1.3', '1 3', 'Sub Bidang Administrasi Kependudukan, Pencatatan Sipil, Statistik dan Kearsipan', 'sub_bidang', '1'),
('1.3.01', '1 3 01', 'Pelayanan administrasi umum dan kependudukan (Surat Pengantar/Pelayanan KTP, Akta Kelahiran, Kartu Keluarga, dll)', 'kegiatan', '1.3'),
('1.3.02', '1 3 02', 'Penyusunan/Pendataan/Pemutakhiran Profil Desa (profil kependudukan dan potensi desa)**', 'kegiatan', '1.3'),
('1.3.03', '1 3 03', 'Pengelolaan administrasi dan kearsipan pemerintahan desa', 'kegiatan', '1.3'),
('1.3.04', '1 3 04', 'Penyuluhan dan Penyadaran Masyarakat tentang Kependudukan dan Pencatatan Sipil', 'kegiatan', '1.3'),
('1.3.05', '1 3 05', 'Pemetaan dan Analisis Kemiskinan Desa secara Partisipatif', 'kegiatan', '1.3'),
('1.3.90', '1 3 90-99', 'lain-lain kegiatan sub bidang administrasi kependudukan, pencatatan sipil, statistik dan kearsipan*', 'kegiatan', '1.3'),

-- SUB BIDANG 1.4
('1.4', '1 4', 'Sub Bidang Tata Praja Pemerintahan, Perencanaan, Keuangan dan Pelaporan', 'sub_bidang', '1'),
('1.4.01', '1 4 01', 'Penyelenggaraan Musyawarah Perencanaan Desa/Pembahasan APBDes (Musdes, Musrenbangdes/Pra-Musrenbangdes, dll., bersifat reguler)', 'kegiatan', '1.4'),
('1.4.02', '1 4 02', 'Penyelenggaraan Musyawarah Desa lainnya (musdus, rembug warga, dll., yang bersifat non-reguler sesuai kebutuhan desa)', 'kegiatan', '1.4'),
('1.4.03', '1 4 03', 'Penyusunan Dokumen Perencanaan Desa (RPJMDes/RKPDes, dll)', 'kegiatan', '1.4'),
('1.4.04', '1 4 04', 'Penyusunan Dokumen Keuangan Desa (APBDes/ APBDes Perubahan/ LPJ APBDes, dan seluruh dokumen terkait)', 'kegiatan', '1.4'),
('1.4.05', '1 4 05', 'Pengelolaan/Administrasi/Inventarisasi/Penilaian Aset Desa', 'kegiatan', '1.4'),
('1.4.06', '1 4 06', 'Penyusunan Kebijakan Desa (Perdes/Perkades, dll- diluar dokumen Rencana Pembangunan/Keuangan)', 'kegiatan', '1.4'),
('1.4.07', '1 4 07', 'Penyusunan Laporan Kepala Desa/Penyelenggaraan Pemerintahan Desa (laporan akhir tahun anggaran, laporan akhir masa jabatan, laporan keterangan akhir tahun anggaran, informasi kepada masyarakat)', 'kegiatan', '1.4'),
('1.4.08', '1 4 08', 'Pengembangan Sistem Informasi Desa', 'kegiatan', '1.4'),
('1.4.09', '1 4 09', 'Koordinasi/Kerjasama Penyelenggaraan Pemerintahan dan Pembangunan Desa (Antar Desa/Kecamatan/Kabupaten, Pihak Ketiga, dll)**', 'kegiatan', '1.4'),
('1.4.10', '1 4 10', 'Dukungan Pelaksanaan dan Sosialisasi Pilkades, Pemilihan Kepala Kewilayahan dan Pemilihan BPD (yang menjadi wewenang Desa)', 'kegiatan', '1.4'),
('1.4.11', '1 4 11', 'Penyelenggaraan Lomba antar kewilayahan dan pengiriman kontingen dalam mengikuti Lomba Desa', 'kegiatan', '1.4'),
('1.4.90', '1 4 90-99', 'lain-lain kegiatan sub bidang tata praja pemerintahan, perencanaan, keuangan dan pelaporan*', 'kegiatan', '1.4'),

-- SUB BIDANG 1.5
('1.5', '1 5', 'Sub Bidang Pertanahan', 'sub_bidang', '1'),
('1.5.01', '1 5 01', 'Sertifikasi Tanah Kas Desa', 'kegiatan', '1.5'),
('1.5.02', '1 5 02', 'Administrasi Pertanahan (Pendaftaran Tanah, dan Pemberian Registrasi Agenda Pertanahan)', 'kegiatan', '1.5'),
('1.5.03', '1 5 03', 'Fasilitasi Sertifikasi Tanah untuk Masyarakat Miskin', 'kegiatan', '1.5'),
('1.5.04', '1 5 04', 'Mediasi Konflik Pertanahan', 'kegiatan', '1.5'),
('1.5.05', '1 5 05', 'Penyuluhan Pertanahan', 'kegiatan', '1.5'),
('1.5.06', '1 5 06', 'Administrasi Pajak Bumi dan Bangunan (PBB)', 'kegiatan', '1.5'),
('1.5.07', '1 5 07', 'Penentuan/Penegasan/Pembangunan Batas/Patok Tanah Desa **', 'kegiatan', '1.5'),
('1.5.90', '1 5 90-99', 'lain-lain kegiatan sub bidang pertanahan*', 'kegiatan', '1.5'),

-- BIDANG 2: PELAKSANAAN PEMBANGUNAN DESA
('2', '2', 'BIDANG PELAKSANAAN PEMBANGUNAN DESA', 'bidang', NULL),

-- SUB BIDANG 2.1
('2.1', '2 1', 'Sub Bidang Pendidikan', 'sub_bidang', '2'),
('2.1.01', '2 1 01', 'Penyelenggaraan PAUD/TK/ΤΡΑ/ΤΚΑ/TPQ/Madrasah Non-Formal Milik Desa** (Bantuan Honor Pengajar, Pakaian Seragam, Operasional, dst)', 'kegiatan', '2.1'),
('2.1.02', '2 1 02', 'Dukungan Penyelenggaraan PAUD (APE, Sarana PAUD, dst)', 'kegiatan', '2.1'),
('2.1.03', '2 1 03', 'Penyuluhan dan Pelatihan Pendidikan bagi Masyarakat', 'kegiatan', '2.1'),
('2.1.04', '2 1 04', 'Pemeliharaan Sarana dan Prasarana Perpustakaan/Taman Bacaan Desa/ Sanggar Belajar Milik Desa **', 'kegiatan', '2.1'),
('2.1.05', '2 1 05', 'Pemeliharaan Sarana dan Prasarana PAUD/TK/TPA/TKA/TPQ/Madrasah Non-Formal Milik Desa**', 'kegiatan', '2.1'),
('2.1.06', '2 1 06', 'Pembangunan/Rehabilitasi/Peningkatan/Pengadaan Sarana/Prasarana/Alat Peraga Edukatif (APE) PAUD/TK/ΤΡΑ/ΤΚΑ/TPQ/Madrasah Non-Formal Milik Desa**', 'kegiatan', '2.1'),
('2.1.07', '2 1 07', 'Pembangunan/Rehabilitasi/Peningkatan Sarana Prasarana Perpustakaan/Taman Bacaan Desa/ Sanggar Belajar Milik Desa**', 'kegiatan', '2.1'),
('2.1.08', '2 1 08', 'Pengelolaan Perpustakaan Milik Desa (Pengadaan Buku-buku Bacaan, Honor Penjaga untuk Perpustakaan/Taman Bacaan Desa)', 'kegiatan', '2.1'),
('2.1.09', '2 1 09', 'Pengembangan dan Pembinaan Sanggar Seni dan Belajar', 'kegiatan', '2.1'),
('2.1.10', '2 1 10', 'Dukungan Pendidikan bagi Siswa Miskin/Berprestasi', 'kegiatan', '2.1'),
('2.1.90', '2 1 90-99', 'lain-lain kegiatan sub bidang pendidikan*', 'kegiatan', '2.1'),

-- SUB BIDANG 2.2
('2.2', '2 2', 'Sub Bidang Kesehatan', 'sub_bidang', '2'),
('2.2.01', '2 2 01', 'Penyelenggaraan Pos Kesehatan Desa (PKD)/Polindes Milik Desa (Obat-obatan; Tambahan Insentif Bidan Desa/Perawat Desa; Penyediaan Pelayanan KB dan Alat Kontrasepsi bagi Keluarga Miskin, dst)', 'kegiatan', '2.2'),
('2.2.02', '2 2 02', 'Penyelenggaraan Posyandu (Makanan Tambahan, Kelas Ibu Hamil, Kelas Lansia, Insentif Kader Posyandu)', 'kegiatan', '2.2'),
('2.2.03', '2 2 03', 'Penyuluhan dan Pelatihan Bidang Kesehatan (untuk Masyarakat, Tenaga Kesehatan, Kader Kesehatan, dll)', 'kegiatan', '2.2'),
('2.2.04', '2 2 04', 'Penyelenggaraan Desa Siaga Kesehatan', 'kegiatan', '2.2'),
('2.2.05', '2 2 05', 'Pembinaan Palang Merah Remaja (PMR) tingkat desa', 'kegiatan', '2.2'),
('2.2.06', '2 2 06', 'Pengasuhan Bersama atau Bina Keluarga Balita (BKB)', 'kegiatan', '2.2'),
('2.2.07', '2 2 07', 'Pembinaan dan Pengawasan Upaya Kesehatan Tradisional', 'kegiatan', '2.2'),
('2.2.08', '2 2 08', 'Pemeliharaan Sarana/Prasarana Posyandu/Polindes/PKD', 'kegiatan', '2.2'),
('2.2.09', '2 2 09', 'Pembangunan/Rehabilitasi/Peningkatan/Pengadaan Sarana/Prasarana Posyandu/Polindes/PKD **', 'kegiatan', '2.2'),
('2.2.90', '2 2 90-99', 'lain-lain kegiatan sub bidang kesehatan*', 'kegiatan', '2.2'),

-- SUB BIDANG 2.3
('2.3', '2 3', 'Sub Bidang Pekerjaan Umum dan Penataan Ruang', 'sub_bidang', '2'),
('2.3.01', '2 3 01', 'Pemeliharaan Jalan Desa', 'kegiatan', '2.3'),
('2.3.02', '2 3 02', 'Pemeliharaan Jalan Lingkungan Permukiman/Gang', 'kegiatan', '2.3'),
('2.3.03', '2 3 03', 'Pemeliharaan Jalan Usaha Tani', 'kegiatan', '2.3'),
('2.3.04', '2 3 04', 'Pemeliharaan Jembatan Milik Desa', 'kegiatan', '2.3'),
('2.3.05', '2 3 05', 'Pemeliharaan Prasarana Jalan Desa (Gorong-gorong, Selokan, Box/Slab Culvert, Drainase, Prasarana Jalan lain)', 'kegiatan', '2.3'),
('2.3.06', '2 3 06', 'Pemeliharaan Gedung/Prasarana Balai Desa/Balai Kemasyarakatan', 'kegiatan', '2.3'),
('2.3.07', '2 3 07', 'Pemeliharaan Pemakaman Milik Desa/Situs Bersejarah Milik Desa/Petilasan Milik', 'kegiatan', '2.3'),
('2.3.08', '2 3 08', 'Pemeliharaan Embung Milik Desa', 'kegiatan', '2.3'),
('2.3.09', '2 3 09', 'Pemeliharaan Monumen/Gapura/Batas Desa', 'kegiatan', '2.3'),
('2.3.10', '2 3 10', 'Pembangunan/Rehabilitasi/Peningkatan/Pengerasan Jalan Desa **', 'kegiatan', '2.3'),
('2.3.11', '2 3 11', 'Pembangunan/Rehabilitasi/Peningkatan/Pengerasan Jalan Lingkungan Permukiman/Gang **', 'kegiatan', '2.3'),
('2.3.12', '2 3 12', 'Pembangunan/Rehabilitasi/Peningkatan/Pengerasan Jalan Usaha Tani **', 'kegiatan', '2.3'),
('2.3.13', '2 3 13', 'Pembangunan/Rehabilitasi/Peningkatan/Pengerasan Jembatan Milik Desa **', 'kegiatan', '2.3'),
('2.3.14', '2 3 14', 'Pembangunan/Rehabilitasi/Peningkatan Prasarana Jalan Desa (Gorong-gorong, Selokan, Box/Slab Culvert, Drainase, Prasarana Jalan lain) **', 'kegiatan', '2.3'),
('2.3.15', '2 3 15', 'Pembangunan/Rehabilitasi/Peningkatan Balai Desa/Balai Kemasyarakatan**', 'kegiatan', '2.3'),
('2.3.16', '2 3 16', 'Pembangunan/Rehabilitasi/Peningkatan Pemakaman Milik Desa/Situs Bersejarah Milik Desa/Petilasan', 'kegiatan', '2.3'),
('2.3.17', '2 3 17', 'Pembuatan/Pemutakhiran Peta Wilayah dan Sosial Desa **', 'kegiatan', '2.3'),
('2.3.18', '2 3 18', 'Penyusunan Dokumen Perencanaan Tata Ruang Desa', 'kegiatan', '2.3'),
('2.3.19', '2 3 19', 'Pembangunan/Rehabilitasi/Peningkatan Embung Desa **', 'kegiatan', '2.3'),
('2.3.20', '2 3 20', 'Pembangunan/Rehabilitasi/Peningkatan Monumen/Gapura/Batas Desa **', 'kegiatan', '2.3'),
('2.3.90', '2 3 90-99', 'lain-lain kegiatan sub bidang pekerjaan umum dan penataan ruang*', 'kegiatan', '2.3'),

-- SUB BIDANG 2.4
('2.4', '2 4', 'Sub Bidang Kawasan Permukiman', 'sub_bidang', '2'),
('2.4.01', '2 4 01', 'Dukungan pelaksanaan program Pembangunan/Rehab Rumah Tidak Layak Huni (RTLH) GAKIN (pemetaan, validasi, dll)', 'kegiatan', '2.4'),
('2.4.02', '2 4 02', 'Pemeliharaan Sumur Resapan Milik Desa', 'kegiatan', '2.4'),
('2.4.03', '2 4 03', 'Pemeliharaan Sumber Air Bersih Milik Desa (Mata Air/Tandon Penampungan Air Hujan/Sumur Bor, dll)', 'kegiatan', '2.4'),
('2.4.04', '2 4 04', 'Pemeliharaan Sambungan Air Bersih ke Rumah Tangga (pipanisasi, dll)', 'kegiatan', '2.4'),
('2.4.05', '2 4 05', 'Pemeliharaan Sanitasi Permukiman (Gorong-gorong, Selokan, Parit, dll., diluar prasarana jalan)', 'kegiatan', '2.4'),
('2.4.06', '2 4 06', 'Pemeliharaan Fasilitas Jamban Umum/MCK umum, dll', 'kegiatan', '2.4'),
('2.4.07', '2 4 07', 'Pemeliharaan Fasilitas Pengelolaan Sampah Desa/Permukiman (Penampungan, Bank Sampah, dll)', 'kegiatan', '2.4'),
('2.4.08', '2 4 08', 'Pemeliharaan Sistem Pembuangan Air Limbah (Drainase, Air limbah Rumah Tangga)', 'kegiatan', '2.4'),
('2.4.09', '2 4 09', 'Pemeliharaan Taman/Taman Bermain Anak Milik Desa', 'kegiatan', '2.4'),
('2.4.10', '2 4 10', 'Pembangunan/Rehabilitasi/Peningkatan Sumur Resapan **', 'kegiatan', '2.4'),
('2.4.11', '2 4 11', 'Pembangunan/Rehabilitasi/Peningkatan Sumber Air Bersih Milik Desa (Mata Air/Tandon Penampungan Air Hujan/Sumur Bor, dll)**', 'kegiatan', '2.4'),
('2.4.12', '2 4 12', 'Pembangunan/Rehabilitasi/Peningkatan Sambungan Air Bersih ke Rumah Tangga (pipanisasi, dll) **', 'kegiatan', '2.4'),
('2.4.13', '2 4 13', 'Pembangunan/Rehabilitasi/Peningkatan Sanitasi Permukiman (Gorong-gorong, Selokan, Parit, dll., diluar prasarana jalan) **', 'kegiatan', '2.4'),
('2.4.14', '2 4 14', 'Pembangunan/Rehabilitas/Peningkatan Fasilitas Jamban Umum/MCK umum, dll **', 'kegiatan', '2.4'),
('2.4.15', '2 4 15', 'Pembangunan/Rehabilitasi/Peningkatan Fasilitas Pengelolaan Sampah Desa/Permukiman (Penampungan, Bank Sampah, dll)**', 'kegiatan', '2.4'),
('2.4.16', '2 4 16', 'Pembangunan/Rehabilitasi/Peningkatan Sistem Pembuangan Air Limbah (Drainase, Air limbah Rumah Tangga)**', 'kegiatan', '2.4'),
('2.4.17', '2 4 17', 'Pembangunan/Rehabilitasi/Peningkatan Taman/Taman Bermain Anak Milik Desa**', 'kegiatan', '2.4'),
('2.4.90', '2 4 90-99', 'lain-lain kegiatan sub bidang perumahan rakyat dan kawasan pemukiman*', 'kegiatan', '2.4'),

-- SUB BIDANG 2.5
('2.5', '2 5', 'Sub Bidang Kehutanan dan Lingkungan Hidup', 'sub_bidang', '2'),
('2.5.01', '2 5 01', 'Pengelolaan Hutan Milik Desa', 'kegiatan', '2.5'),
('2.5.02', '2 5 02', 'Pengelolaan Lingkungan Hidup Desa', 'kegiatan', '2.5'),
('2.5.03', '2 5 03', 'Pelatihan/Sosialisasi/Penyuluhan/Penyadaran tentang Lingkungan Hidup dan Kehutanan', 'kegiatan', '2.5'),
('2.5.90', '2 5 90-99', 'lain-lain kegiatan sub bidang Kehutanan dan Lingkungan Hidup*', 'kegiatan', '2.5'),

-- SUB BIDANG 2.6
('2.6', '2 6', 'Sub Bidang Perhubungan, Komunikasi, dan Informatika', 'sub_bidang', '2'),
('2.6.01', '2 6 01', 'Pembuatan Rambu-rambu di Jalan Desa', 'kegiatan', '2.6'),
('2.6.02', '2 6 02', 'Penyelenggaraan Informasi Publik Desa (Misal: Pembuatan Poster/Baliho Informasi penetapan/LPJ APBDes untuk Warga, dll)', 'kegiatan', '2.6'),
('2.6.03', '2 6 03', 'Pengelolaan dan Pembuatan Jaringan/Instalasi Komunikasi dan Informasi Lokal Desa', 'kegiatan', '2.6'),
('2.6.90', '2 6 90-99', 'lain-lain kegiatan sub bidang Perhubungan, Komunikasi, dan Informatika*', 'kegiatan', '2.6'),

-- SUB BIDANG 2.7
('2.7', '2 7', 'Sub Bidang Energi dan Sumber Daya Mineral', 'sub_bidang', '2'),
('2.7.01', '2 7 01', 'Pemeliharaan Sarana dan Prasarana Energi Alternatif tingkat Desa', 'kegiatan', '2.7'),
('2.7.02', '2 7 02', 'Pembangunan/Rehabilitasi/Peningkatan Sarana dan Prasarana Energi Alternatif tingkat Desa **', 'kegiatan', '2.7'),
('2.7.90', '2 7 90-99', 'lain-lain kegiatan sub bidang Energi dan Sumber Daya Mineral*', 'kegiatan', '2.7'),

-- SUB BIDANG 2.8
('2.8', '2 8', 'Sub Bidang Pariwisata', 'sub_bidang', '2'),
('2.8.01', '2 8 01', 'Pemeliharaan Sarana dan Prasarana Pariwisata Milik Desa', 'kegiatan', '2.8'),
('2.8.02', '2 8 02', 'Pembangunan/Rehabilitasi/Peningkatan Sarana dan Prasarana Pariwisata Milik Desa', 'kegiatan', '2.8'),
('2.8.03', '2 8 03', 'Pengembangan Pariwisata Tingkat Desa', 'kegiatan', '2.8'),
('2.8.90', '2 8 90-99', 'lain-lain kegiatan sub bidang pariwisata*', 'kegiatan', '2.8'),

-- BIDANG 3: PEMBINAAN KEMASYARAKATAN DESA
('3', '3', 'BIDANG PEMBINAAN KEMASYARAKATAN DESA', 'bidang', NULL),

-- SUB BIDANG 3.1
('3.1', '3 1', 'Sub Bidang Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat', 'sub_bidang', '3'),
('3.1.01', '3 1 01', 'Pengadaan/Penyelenggaraan Pos Keamanan Desa (pembangunan pos, pengawasan pelaksanaan jadwal ronda/patroli dll) **', 'kegiatan', '3.1'),
('3.1.02', '3 1 02', 'Penguatan dan Peningkatan Kapasitas Tenaga Keamanan/Ketertiban oleh Pemerintah Desa (Satlinmas desa)', 'kegiatan', '3.1'),
('3.1.03', '3 1 03', 'Koordinasi Pembinaan Ketentraman, Ketertiban, dan Pelindungan Masyarakat (dengan masyarakat/instansi pemerintah daerah, dll) Skala Lokal Desa', 'kegiatan', '3.1'),
('3.1.04', '3 1 04', 'Pelatihan Kesiapsiagaan/Tanggap Bencana Skala Lokal Desa', 'kegiatan', '3.1'),
('3.1.05', '3 1 05', 'Penyediaan Pos Kesiapsiagaan Bencana Skala Lokal Desa', 'kegiatan', '3.1'),
('3.1.06', '3 1 06', 'Bantuan Hukum Untuk Aparatur Desa dan Masyarakat Miskin', 'kegiatan', '3.1'),
('3.1.07', '3 1 07', 'Pelatihan/Penyuluhan/Sosialisasi kepada Masyarakat di Bidang Hukum dan Pelindungan Masyarakat', 'kegiatan', '3.1'),
('3.1.90', '3 1 90-99', 'lain-lain kegiatan sub bidang Ketenteraman, Ketertiban Umum, dan Pelindungan Masyarakat*', 'kegiatan', '3.1'),

-- SUB BIDANG 3.2
('3.2', '3 2', 'Sub Bidang Kebudayaan dan Keagamaan', 'sub_bidang', '3'),
('3.2.01', '3 2 01', 'Pembinaan Group Kesenian dan Kebudayaan Tingkat Desa', 'kegiatan', '3.2'),
('3.2.02', '3 2 02', 'Pengiriman Kontingen Group Kesenian dan Kebudayaan sebagai Wakil Desa di tingkat Kecamatan dan Kabupaten/Kota', 'kegiatan', '3.2'),
('3.2.03', '3 2 03', 'Penyelenggaraan Festival Kesenian, Adat/Kebudayaan, dan Keagamaan (perayaan hari kemerdekaan, hari besar keagamaan, dll) tingkat Desa', 'kegiatan', '3.2'),
('3.2.04', '3 2 04', 'Pemeliharaan Sarana dan Prasarana Kebudayaan/Rumah Adat/Keagamaan Milik Desa **', 'kegiatan', '3.2'),
('3.2.05', '3 2 05', 'Pembangunan/Rehabilitasi/Peningkatan Sarana dan Prasarana Kebudayaan/Rumah Adat/Keagamaan Milik Desa **', 'kegiatan', '3.2'),
('3.2.90', '3 2 90-99', 'lain-lain kegiatan sub bidang Kebudayaan dan Keagamaan*', 'kegiatan', '3.2'),

-- SUB BIDANG 3.3
('3.3', '3 3', 'Sub Bidang Kepemudaan dan Olah Raga', 'sub_bidang', '3'),
('3.3.01', '3 3 01', 'Pengiriman Kontingen Kepemudaan dan Olah Raga sebagai Wakil Desa di tingkat Kecamatan dan Kabupaten/Kota', 'kegiatan', '3.3'),
('3.3.02', '3 3 02', 'Penyelenggaraan pelatihan kepemudaan (Kepemudaan, Penyadaraan Wawasan Kebangsaan, dll) tingkat Desa', 'kegiatan', '3.3'),
('3.3.03', '3 3 03', 'Penyelenggaraan Festival/Lomba Kepemudaan dan Olahraga tingkat Desa', 'kegiatan', '3.3'),
('3.3.04', '3 3 04', 'Pemeliharaan Sarana dan Prasarana Kepemudaan dan Olah Raga Milik Desa**', 'kegiatan', '3.3'),
('3.3.05', '3 3 05', 'Pembangunan/Rehabilitasi/Peningkatan Sarana dan Prasarana Kepemudaan dan Olah Raga Milik Desa**', 'kegiatan', '3.3'),
('3.3.06', '3 3 06', 'Pembinaan Karang Taruna/Klub Kepemudaan/Klub Olah raga', 'kegiatan', '3.3'),
('3.3.90', '3 3 90-99', 'lain-lain kegiatan sub bidang Kepemudaan dan Olah Raga*', 'kegiatan', '3.3'),

-- SUB BIDANG 3.4
('3.4', '3 4', 'Sub Bidang Kelembagaan Masyarakat', 'sub_bidang', '3'),
('3.4.01', '3 4 01', 'Pembinaan Lembaga Adat', 'kegiatan', '3.4'),
('3.4.02', '3 4 02', 'Pembinaan LKMD/LPM/LPMD', 'kegiatan', '3.4'),
('3.4.03', '3 4 03', 'Pembinaan PKK', 'kegiatan', '3.4'),
('3.4.04', '3 4 04', 'Pelatihan Pembinaan Lembaga Kemasyarakatan', 'kegiatan', '3.4'),
('3.4.90', '3 4 90-99', 'lain-lain kegiatan sub bidang Kelembagaan Masyarakat*', 'kegiatan', '3.4'),

-- BIDANG 4: PEMBERDAYAAN MASYARAKAT DESA
('4', '4', 'BIDANG PEMBERDAYAAN MASYARAKAT DESA', 'bidang', NULL),

-- SUB BIDANG 4.1
('4.1', '4 1', 'Sub Bidang Kelautan dan Perikanan', 'sub_bidang', '4'),
('4.1.01', '4 1 01', 'Pemeliharaan Karamba/Kolam Perikanan Darat Milik Desa', 'kegiatan', '4.1'),
('4.1.02', '4 1 02', 'Pemeliharaan Pelabuhan Perikanan Sungai/Kecil Milik Desa', 'kegiatan', '4.1'),
('4.1.03', '4 1 03', 'Pembangunan/Rehabilitasi/Peningkatan Karamba/Kolam Perikanan Darat Milik Desa**', 'kegiatan', '4.1'),
('4.1.04', '4 1 04', 'Pembangunan/Rehabilitasi/Peningkatan Pelabuhan Perikanan Sungai/Kecil Milik Desa**', 'kegiatan', '4.1'),
('4.1.05', '4 1 05', 'Bantuan Perikanan (Bibit/Pakan/dst)', 'kegiatan', '4.1'),
('4.1.06', '4 1 06', 'Pelatihan/Bimtek/Pengenalan Tekonologi Tepat Guna untuk Perikanan Darat/Nelayan **', 'kegiatan', '4.1'),
('4.1.90', '4 1 90-99', 'lain-lain kegiatan sub bidang kelautan dan perikanan*', 'kegiatan', '4.1'),

-- SUB BIDANG 4.2
('4.2', '4 2', 'Sub Bidang Pertanian dan Peternakan', 'sub_bidang', '4'),
('4.2.01', '4 2 01', 'Peningkatan Produksi Tanaman Pangan (Alat Produksi dan pengolahan pertanian, penggilingan Padi/jagung, dll)', 'kegiatan', '4.2'),
('4.2.02', '4 2 02', 'Peningkatan Produksi Peternakan (Alat Produksi dan pengolahan peternakan, kandang, dll)', 'kegiatan', '4.2'),
('4.2.03', '4 2 03', 'Penguatan Ketahanan Pangan Tingkat Desa (Lumbung Desa, dll)', 'kegiatan', '4.2'),
('4.2.04', '4 2 04', 'Pemeliharan Saluran Irigasi Tersier/Sederhana', 'kegiatan', '4.2'),
('4.2.05', '4 2 05', 'Pelatihan/Bimtek/Pengenalan Tekonologi Tepat Guna untuk Pertanian/Peternakan *', 'kegiatan', '4.2'),
('4.2.90', '4 2 90-99', 'lain-lain kegiatan sub bidang Pertanian dan Peternakan*', 'kegiatan', '4.2'),

-- SUB BIDANG 4.3
('4.3', '4 3', 'Sub Bidang Peningkatan Kapasitas Aparatur Desa', 'sub_bidang', '4'),
('4.3.01', '4 3 01', 'Peningkatan kapasitas kepala Desa', 'kegiatan', '4.3'),
('4.3.02', '4 3 02', 'Peningkatan kapasitas perangkat Desa', 'kegiatan', '4.3'),
('4.3.03', '4 3 03', 'Peningkatan kapasitas BPD', 'kegiatan', '4.3'),
('4.3.90', '4 3 90-99', 'lain-lain kegiatan sub bidang peningkatan kapasitas Aparatur Desa', 'kegiatan', '4.3'),

-- SUB BIDANG 4.4
('4.4', '4 4', 'Sub Bidang Pemberdayaan Perempuan, Perlindungan Anak dan Keluarga', 'sub_bidang', '4'),
('4.4.01', '4 4 01', 'Pelatihan/Penyuluhan Pemberdayaan Perempuan', 'kegiatan', '4.4'),
('4.4.02', '4 4 02', 'Pelatihan/Penyuluhan Perlindungan Anak', 'kegiatan', '4.4'),
('4.4.03', '4 4 03', 'Pelatihan dan Penguatan Penyandang Difabel (penyandang disabilitas)', 'kegiatan', '4.4'),
('4.4.90', '4 4 90-99', 'lain-lain kegiatan sub bidang Pemberdayaan Perempuan dan Perlindungan Anak*', 'kegiatan', '4.4'),

-- SUB BIDANG 4.5
('4.5', '4 5', 'Sub Bidang Koperasi, Usaha Mikro Kecil dan Menengah (UMKM)', 'sub_bidang', '4'),
('4.5.01', '4 5 01', 'Pelatihan Manajemen Pengelolaan Koperasi/ KUD/ UMKM', 'kegiatan', '4.5'),
('4.5.02', '4 5 02', 'Pengembangan Sarana Prasarana Usaha Mikro, Kecil dan Menengah serta Koperasi', 'kegiatan', '4.5'),
('4.5.03', '4 5 03', 'Pengadaan Teknologi Tepat Guna untuk Pengembangan Ekonomi Pedesaan Non-Pertanian', 'kegiatan', '4.5'),
('4.5.90', '4 5 90-99', 'lain-lain kegiatan sub bidang Koperasi, Usaha Kecil dan Menengah*', 'kegiatan', '4.5'),

-- SUB BIDANG 4.6
('4.6', '4 6', 'Sub Bidang Dukungan Penanaman Modal', 'sub_bidang', '4'),
('4.6.01', '4 6 01', 'Pembentukan BUM Desa (Persiapan dan Pembentukan Awal BUM Desa)', 'kegiatan', '4.6'),
('4.6.02', '4 6 02', 'Pelatihan Pengelolaan BUM Desa (Pelatihan yang dilaksanakan oleh Desa)', 'kegiatan', '4.6'),
('4.6.90', '4 6 90-99', 'lain-lain kegiatan sub bidang Penanaman Modal*', 'kegiatan', '4.6'),

-- SUB BIDANG 4.7
('4.7', '4 7', 'Sub Bidang Perdagangan dan Perindustrian', 'sub_bidang', '4'),
('4.7.01', '4 7 01', 'Pemeliharaan Pasar Desa/Kios milik Desa', 'kegiatan', '4.7'),
('4.7.02', '4 7 02', 'Pembangunan/Rehabilitasi/Peningkatan Pasar Desa/Kios milik Desa **', 'kegiatan', '4.7'),
('4.7.03', '4 7 03', 'Pengembangan Industri kecil level Desa', 'kegiatan', '4.7'),
('4.7.04', '4 7 04', 'Pembentukan/Fasilitasi/Pelatihan/Pendampingan kelompok usaha ekonomi produktif (pengrajin, pedagang, industri rumah tangga, dll) **', 'kegiatan', '4.7'),
('4.7.90', '4 7 90-99', 'lain-lain kegiatan sub bidang Perdagangan dan Perindustrian*', 'kegiatan', '4.7'),

-- BIDANG 5: PENANGGULANGAN BENCANA, KEADAAN DARURAT DAN MENDESAK
('5', '5', 'BIDANG PENANGGULANGAN BENCANA, KEADAAN DARURAT DAN MENDESAK', 'bidang', NULL),

-- SUB BIDANG 5.1
('5.1', '5 1', 'Sub Bidang Penanggulangan Bencana', 'sub_bidang', '5'),
('5.1.00', '5 1 00', 'Penanggulangan Bencana', 'kegiatan', '5.1'),

-- SUB BIDANG 5.2
('5.2', '5 2', 'Sub Bidang Keadaan Darurat', 'sub_bidang', '5'),
('5.2.00', '5 2 00', 'Keadaan Darurat', 'kegiatan', '5.2'),

-- SUB BIDANG 5.3
('5.3', '5 3', 'Sub Bidang Keadaan Mendesak.', 'sub_bidang', '5'),
('5.3.00', '5 3 00', 'Keadaan Mendesak', 'kegiatan', '5.3')
ON CONFLICT (id) DO NOTHING;


-- =========================
-- SEED: kode_ekonomi
-- =========================

INSERT INTO kode_ekonomi (id, full_code, uraian, level, parent_id) VALUES
-- AKUN 4: PENDAPATAN
('4', '4', 'PENDAPATAN', 'akun', NULL),

-- KELOMPOK 4.1: Pendapatan Asli Desa
('4.1', '4 1', 'Pendapatan Asli Desa', 'kelompok', '4'),
('4.1.1', '4 1 1', 'Hasil Usaha', 'jenis', '4.1'),
('4.1.1.01', '4 1 1 01', 'Bagi Hasil BUMDes', 'objek', '4.1.1'),
('4.1.1.90', '4 1 1 90-99', 'Lain-lain', 'objek', '4.1.1'),
('4.1.2', '4 1 2', 'Hasil Aset', 'jenis', '4.1'),
('4.1.2.01', '4 1 2 01', 'Pengelolaan Tanah Kas Desa', 'objek', '4.1.2'),
('4.1.2.02', '4 1 2 02', 'Tambatan Perahu', 'objek', '4.1.2'),
('4.1.2.03', '4 1 2 03', 'Pasar Desa', 'objek', '4.1.2'),
('4.1.2.04', '4 1 2 04', 'Tempat Pemandian Umum', 'objek', '4.1.2'),
('4.1.2.05', '4 1 2 05', 'Jaringan Irigasi Desa', 'objek', '4.1.2'),
('4.1.2.06', '4 1 2 06', 'Pelelangan Ikan Milik Desa', 'objek', '4.1.2'),
('4.1.2.07', '4 1 2 07', 'Kios Milik Desa', 'objek', '4.1.2'),
('4.1.2.08', '4 1 2 08', 'Pemanfaatan Lapangan/Prasarana Olah raga Milik Desa', 'objek', '4.1.2'),
('4.1.2.90', '4 1 2 90-99', 'Lain-lain', 'objek', '4.1.2'),
('4.1.3', '4 1 3', 'Swadaya, Partisipasi dan Gotong Royong', 'jenis', '4.1'),
('4.1.3.01', '4 1 3 01', 'Swadaya, partisipasi dan gotong royong', 'objek', '4.1.3'),
('4.1.3.90', '4 1 3 90-99', 'Lain-lain Swadaya, Partisipasi dan Gotong Royong', 'objek', '4.1.3'),
('4.1.4', '4 1 4', 'Lain-lain Pendapatan Asli Desa', 'jenis', '4.1'),
('4.1.4.01', '4 1 4 01', 'Hasil Pungutan Desa', 'objek', '4.1.4'),
('4.1.4.90', '4 1 4 90-99', 'Lain-lain', 'objek', '4.1.4'),

-- KELOMPOK 4.2: Transfer
('4.2', '4 2', 'Transfer', 'kelompok', '4'),
('4.2.1', '4 2 1', 'Dana Desa', 'jenis', '4.2'),
('4.2.1.01', '4 2 1 01', 'Dana Desa', 'objek', '4.2.1'),
('4.2.2', '4 2 2', 'Bagian dari Hasil Pajak dan Retribusi Daerah Kabupaten/kota', 'jenis', '4.2'),
('4.2.2.01', '4 2 2 01', 'Bagian dari Hasil Pajak dan Retribusi Daerah Kabupaten/kota', 'objek', '4.2.2'),
('4.2.3', '4 2 3', 'Alokasi Dana Desa', 'jenis', '4.2'),
('4.2.3.01', '4 2 3 01', 'Alokasi Dana Desa', 'objek', '4.2.3'),
('4.2.4', '4 2 4', 'Bantuan Keuangan Provinsi', 'jenis', '4.2'),
('4.2.4.01', '4 2 4 01', 'Bantuan Keuangan dari APBD Provinsi', 'objek', '4.2.4'),
('4.2.4.90', '4 2 4 90-99', 'Lain-lain Bantuan Keuangan dari APBD Provinsi', 'objek', '4.2.4'),
('4.2.5', '4 2 5', 'Bantuan Keuangan APBD Kabupaten/Kota', 'jenis', '4.2'),
('4.2.5.01', '4 2 5 01', 'Bantuan Keuangan APBD Kabupaten/Kota', 'objek', '4.2.5'),
('4.2.5.90', '4 2 5 90-99', 'Lain-lain Bantuan Keuangan dari APBD Kabupaten/Kota', 'objek', '4.2.5'),

-- KELOMPOK 4.3: Pendapatan Lain-lain
('4.3', '4 3', 'Pendapatan Lain-lain', 'kelompok', '4'),
('4.3.1', '4 3 1', 'Penerimaan dari Hasil Kerjasama antar Desa', 'jenis', '4.3'),
('4.3.1.01', '4 3 1 01', 'Penerimaan dari Hasil Kerjasama antar Desa', 'objek', '4.3.1'),
('4.3.2', '4 3 2', 'Penerimaan dari Hasil Kerjasama Desa dengan Pihak Ketiga', 'jenis', '4.3'),
('4.3.2.01', '4 3 2 01', 'Penerimaan dari Hasil Kerjasama Desa dengan Pihak Ketiga', 'objek', '4.3.2'),
('4.3.3', '4 3 3', 'Penerimaan dari Bantuan Perusahaan yang berlokasi di Desa', 'jenis', '4.3'),
('4.3.3.01', '4 3 3 01', 'Penerimaan dari Bantuan Perusahaan yang berlokasi di Desa', 'objek', '4.3.3'),
('4.3.4', '4 3 4', 'Hibah dan sumbangan dari Pihak Ketiga', 'jenis', '4.3'),
('4.3.4.01', '4 3 4 01', 'Hibah dan sumbangan dari Pihak Ketiga', 'objek', '4.3.4'),
('4.3.5', '4 3 5', 'Koreksi kesalahan belanja tahun-tahun anggaran sebelumnya yang mengakibatkan penerimaan di kas Desa pada tahun anggaran berjalan', 'jenis', '4.3'),
('4.3.5.01', '4 3 5 01', 'Koreksi kesalahan belanja tahun-tahun anggaran sebelumnya yang mengakibatkan penerimaan di kas Desa pada tahun anggaran berjalan', 'objek', '4.3.5'),
('4.3.6', '4 3 6', 'Bunga Bank', 'jenis', '4.3'),
('4.3.6.01', '4 3 6 01', 'Bunga Bank', 'objek', '4.3.6'),
('4.3.9', '4 3 9', 'Lain-lain pendapatan Desa yang sah', 'jenis', '4.3'),
('4.3.9.90', '4 3 9 90-99', 'Lain-lain pendapatan Desa yang sah', 'objek', '4.3.9'),

-- AKUN 5: BELANJA
('5', '5', 'BELANJA', 'akun', NULL),

-- KELOMPOK 5.1: Belanja Pegawai
('5.1', '5 1', 'Belanja Pegawai', 'kelompok', '5'),
('5.1.1', '5 1 1', 'Penghasilan Tetap dan Tunjangan Kepala Desa', 'jenis', '5.1'),
('5.1.1.01', '5 1 1 01', 'Penghasilan Tetap Kepala Desa', 'objek', '5.1.1'),
('5.1.1.02', '5 1 1 02', 'Tunjangan Kepala Desa', 'objek', '5.1.1'),
('5.1.1.90', '5 1 1 90-99', 'Penerimaan Lain Kepala Desa yang Sah', 'objek', '5.1.1'),
('5.1.2', '5 1 2', 'Penghasilan Tetap dan Tunjangan Perangkat Desa', 'jenis', '5.1'),
('5.1.2.01', '5 1 2 01', 'Penghasilan Tetap Perangkat Desa', 'objek', '5.1.2'),
('5.1.2.02', '5 1 2 02', 'Tunjangan Perangkat Desa', 'objek', '5.1.2'),
('5.1.2.90', '5 1 2 90-99', 'Penerimaan Lain Perangkat Desa yang Sah', 'objek', '5.1.2'),
('5.1.3', '5 1 3', 'Jaminan Sosial Kepala Desa dan Perangkat Desa', 'jenis', '5.1'),
('5.1.3.01', '5 1 3 01', 'Jaminan Kesehatan Kepala Desa', 'objek', '5.1.3'),
('5.1.3.02', '5 1 3 02', 'Jaminan Kesehatan Perangkat Desa', 'objek', '5.1.3'),
('5.1.3.03', '5 1 3 03', 'Jaminan Ketenagakerjaan Kepala Desa', 'objek', '5.1.3'),
('5.1.3.04', '5 1 3 04', 'Jaminan Ketenagakerjaan Perangkat Desa', 'objek', '5.1.3'),
('5.1.4', '5 1 4', 'Tunjangan BPD', 'jenis', '5.1'),
('5.1.4.01', '5 1 4 01', 'Tunjangan Kedudukan BPD', 'objek', '5.1.4'),
('5.1.4.02', '5 1 4 02', 'Tunjangan Kinerja BPD', 'objek', '5.1.4'),

-- KELOMPOK 5.2: Belanja Barang dan Jasa
('5.2', '5 2', 'Belanja Barang dan Jasa', 'kelompok', '5'),
('5.2.1', '5 2 1', 'Belanja Barang Perlengkapan', 'jenis', '5.2'),
('5.2.1.01', '5 2 1 01', 'Belanja Perlengkapan Alat Tulis Kantor dan Benda Pos', 'objek', '5.2.1'),
('5.2.1.02', '5 2 1 02', 'Belanja Perlengkapan Alat-alat Listrik', 'objek', '5.2.1'),
('5.2.1.03', '5 2 1 03', 'Belanja Perlengkapan Alat-alat Rumah Tangga/Peralatan dan Bahan Kebersihan', 'objek', '5.2.1'),
('5.2.1.04', '5 2 1 04', 'Belanja Bahan Bakar Minyak/Gas/Isi Ulang Tabung Pemadam Kebakaran', 'objek', '5.2.1'),
('5.2.1.05', '5 2 1 05', 'Belanja Perlengkapan Cetak/Penggandaan Belanja Barang Cetak dan Penggandaan', 'objek', '5.2.1'),
('5.2.1.06', '5 2 1 06', 'Belanja Perlengkapan Barang Konsumsi (Makan/minum) - Belanja Barang Konsumsi', 'objek', '5.2.1'),
('5.2.1.07', '5 2 1 07', 'Belanja Bahan/Material', 'objek', '5.2.1'),
('5.2.1.08', '5 2 1 08', 'Belanja Bendera/Umbul-umbul/Spanduk', 'objek', '5.2.1'),
('5.2.1.09', '5 2 1 09', 'Belanja Pakaian Dinas/Seragam/Atribut', 'objek', '5.2.1'),
('5.2.1.10', '5 2 1 10', 'Belanja Obat-obatan', 'objek', '5.2.1'),
('5.2.1.11', '5 2 1 11', 'Belanja Pakan Hewan/Ikan, Obat-obatan Hewan', 'objek', '5.2.1'),
('5.2.1.12', '5 2 1 12', 'Belanja Pupuk/Obat-obatan Pertanian', 'objek', '5.2.1'),
('5.2.1.90', '5 2 1 90-99', 'Belanja Barang Perlengkapan Lainnya', 'objek', '5.2.1'),
('5.2.2', '5 2 2', 'Belanja Jasa Honorarium', 'jenis', '5.2'),
('5.2.2.01', '5 2 2 01', 'Belanja Jasa Honorarium Tim yang Melaksanakan Kegiatan', 'objek', '5.2.2'),
('5.2.2.02', '5 2 2 02', 'Belanja Jasa Honorarium Pembantu Tugas Umum Desa/Operator', 'objek', '5.2.2'),
('5.2.2.03', '5 2 2 03', 'Belanja Jasa Honorarium/Insentif Pelayanan Desa', 'objek', '5.2.2'),
('5.2.2.04', '5 2 2 04', 'Belanja Jasa Honorarium Ahli/Profesi/Konsultan/Narasumber', 'objek', '5.2.2'),
('5.2.2.05', '5 2 2 05', 'Belanja Jasa Honorarium Petugas', 'objek', '5.2.2'),
('5.2.2.90', '5 2 2 90-99', 'Belanja Jasa Honorarium Lainnya', 'objek', '5.2.2'),
('5.2.3', '5 2 3', 'Belanja Perjalanan Dinas', 'jenis', '5.2'),
('5.2.3.01', '5 2 3 01', 'Belanja Perjalanan Dinas Dalam Kabupaten/Kota', 'objek', '5.2.3'),
('5.2.3.02', '5 2 3 02', 'Belanja Perjalanan Dinas Luar Kabupaten/Kota', 'objek', '5.2.3'),
('5.2.3.03', '5 2 3 03', 'Belanja Kursus/Pelatihan', 'objek', '5.2.3'),
('5.2.4', '5 2 4', 'Belanja Jasa Sewa', 'jenis', '5.2'),
('5.2.4.01', '5 2 4 01', 'Belanja Jasa Sewa Bangunan/Gedung/Ruang', 'objek', '5.2.4'),
('5.2.4.02', '5 2 4 02', 'Belanja Jasa Sewa Peralatan/Perlengkapan', 'objek', '5.2.4'),
('5.2.4.03', '5 2 4 03', 'Belanja Jasa Sewa Sarana Mobilitas', 'objek', '5.2.4'),
('5.2.4.90', '5 2 4 90-99', 'Belanja Jasa Sewa Lainnya', 'objek', '5.2.4'),
('5.2.5', '5 2 5', 'Belanja Operasional Perkantoran', 'jenis', '5.2'),
('5.2.5.01', '5 2 5 01', 'Belanja Jasa Langganan Listrik', 'objek', '5.2.5'),
('5.2.5.02', '5 2 5 02', 'Belanja Jasa Langganan Air Bersih', 'objek', '5.2.5'),
('5.2.5.03', '5 2 5 03', 'Belanja Jasa Langganan Majalah/Surat Kabar', 'objek', '5.2.5'),
('5.2.5.04', '5 2 5 04', 'Belanja Jasa Langganan Telepon', 'objek', '5.2.5'),
('5.2.5.05', '5 2 5 05', 'Belanja Jasa Langganan Internet', 'objek', '5.2.5'),
('5.2.5.06', '5 2 5 06', 'Belanja Jasa Kurir/Pos/Giro', 'objek', '5.2.5'),
('5.2.5.07', '5 2 5 07', 'Belanja Jasa Perpanjangan Ijin/Pajak', 'objek', '5.2.5'),
('5.2.5.90', '5 2 5 90-99', 'Belanja Operasional Perkantoran Lainnya', 'objek', '5.2.5'),
('5.2.6', '5 2 6', 'Belanja Pemeliharaan', 'jenis', '5.2'),
('5.2.6.01', '5 2 6 01', 'Belanja Pemeliharaan Mesin dan Peralatan Berat', 'objek', '5.2.6'),
('5.2.6.02', '5 2 6 02', 'Belanja Pemeliharaan Kendaraan Bermotor', 'objek', '5.2.6'),
('5.2.6.03', '5 2 6 03', 'Belanja Pemeliharaan Peralatan', 'objek', '5.2.6'),
('5.2.6.04', '5 2 6 04', 'Belanja Pemeliharaan Bangunan', 'objek', '5.2.6'),
('5.2.6.05', '5 2 6 05', 'Belanja Pemeliharaan Jalan', 'objek', '5.2.6'),
('5.2.6.06', '5 2 6 06', 'Belanja Pemeliharaan Jembatan', 'objek', '5.2.6'),
('5.2.6.07', '5 2 6 07', 'Belanja Pemeliharaan Irigasi/Saluran Sungai/Embung/Air Bersih, jaringan Air Limbah, Persampahan, dll)', 'objek', '5.2.6'),
('5.2.6.08', '5 2 6 08', 'Belanja Pemeliharaan Jaringan dan Instalasi (Listrik, Telepon, Internet, Komunikasi, dll)', 'objek', '5.2.6'),
('5.2.6.90', '5 2 6 90-99', 'Belanja Pemeliharaan Lainnya', 'objek', '5.2.6'),
('5.2.7', '5 2 7', 'Belanja Barang dan Jasa yang Diserahkan kepada Masyarakat', 'jenis', '5.2'),
('5.2.7.01', '5 2 7 01', 'Belanja Bahan Perlengkapan yang Diserahkan ke masyarakat', 'objek', '5.2.7'),
('5.2.7.02', '5 2 7 02', 'Belanja Bantuan Mesin/Kendaraaan bermotor/Peralatan yang diserahkan ke masyarakat', 'objek', '5.2.7'),
('5.2.7.03', '5 2 7 03', 'Belanja Bantuan Bangunan yang diserahkan ke masyarakat', 'objek', '5.2.7'),
('5.2.7.04', '5 2 7 04', 'Belanja Beasiswa Berprestasi/Masyarakat Miskin', 'objek', '5.2.7'),
('5.2.7.05', '5 2 7 05', 'Belanja Bantuan Bibit Tanaman/Hewan/Ikan', 'objek', '5.2.7'),
('5.2.7.90', '5 2 7 90-99', 'Belanja Barang dan Jasa yang Diserahkan kepada Masyarakat Lainnya', 'objek', '5.2.7'),

-- KELOMPOK 5.3: Belanja Modal
('5.3', '5 3', 'Belanja Modal', 'kelompok', '5'),
('5.3.1', '5 3 1', 'Belanja Modal Pengadaan Tanah', 'jenis', '5.3'),
('5.3.1.01', '5 3 1 01', 'Belanja Modal Pembebasan/Pembelian Tanah', 'objek', '5.3.1'),
('5.3.1.02', '5 3 1 02', 'Belanja Modal Pembayaran Honorarium Tim Tanah', 'objek', '5.3.1'),
('5.3.1.03', '5 3 1 03', 'Belanja Modal Pengukuran dan Pembuatan Sertifikat Tanah', 'objek', '5.3.1'),
('5.3.1.04', '5 3 1 04', 'Belanja Modal Pengurukan dan Pematangan Tanah', 'objek', '5.3.1'),
('5.3.1.05', '5 3 1 05', 'Belanja Modal Perjalanan Pengadaan Tanah', 'objek', '5.3.1'),
('5.3.1.90', '5 3 1 90-99', 'Belanja Modal Pengadaan Tanah Lainnya', 'objek', '5.3.1'),
('5.3.2', '5 3 2', 'Belanja Modal Peralatan, Mesin, dan Alat Berat', 'jenis', '5.3'),
('5.3.2.01', '5 3 2 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.2'),
('5.3.2.02', '5 3 2 02', 'Belanja Modal Peralatan Elektronik dan Alat Studio', 'objek', '5.3.2'),
('5.3.2.03', '5 3 2 03', 'Belanja Modal Peralatan Komputer', 'objek', '5.3.2'),
('5.3.2.04', '5 3 2 04', 'Belanja Modal Peralatan Mebeulair dan Aksesori Ruangan', 'objek', '5.3.2'),
('5.3.2.05', '5 3 2 05', 'Belanja Modal Peralatan Dapur', 'objek', '5.3.2'),
('5.3.2.06', '5 3 2 06', 'Belanja Modal Peralatan Alat Ukur', 'objek', '5.3.2'),
('5.3.2.07', '5 3 2 07', 'Belanja Modal Peralatan Rambu-rambu/Patok Tanah', 'objek', '5.3.2'),
('5.3.2.08', '5 3 2 08', 'Belanja Modal Peralatan khusus Kesehatan', 'objek', '5.3.2'),
('5.3.2.09', '5 3 2 09', 'Belanja Modal Peralatan khusus Pertanian/Perikanan/Peternakan', 'objek', '5.3.2'),
('5.3.2.10', '5 3 2 10', 'Belanja Modal Mesin', 'objek', '5.3.2'),
('5.3.2.11', '5 3 2 11', 'Belanja Modal Pengadaan Alat-Alat Berat', 'objek', '5.3.2'),
('5.3.2.90', '5 3 2 90-99', 'Belanja Modal Peralatan, Mesin, dan Alat Berat Lainnya', 'objek', '5.3.2'),
('5.3.3', '5 3 3', 'Belanja Modal Kendaraan', 'jenis', '5.3'),
('5.3.3.01', '5 3 3 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.3'),
('5.3.3.02', '5 3 3 02', 'Belanja Modal Kendaraan Darat Bermotor', 'objek', '5.3.3'),
('5.3.3.03', '5 3 3 03', 'Belanja Modal Angkutan Darat Tidak Bermotor', 'objek', '5.3.3'),
('5.3.3.04', '5 3 3 04', 'Belanja Modal Kendaraan Air Bermotor', 'objek', '5.3.3'),
('5.3.3.05', '5 3 3 05', 'Belanja Modal Angkutan Air Tidak Bermotor', 'objek', '5.3.3'),
('5.3.3.90', '5 3 3 90-99', 'Belanja Modal Kendaraan Lainnya', 'objek', '5.3.3'),
('5.3.4', '5 3 4', 'Belanja Modal Gedung, Bangunan dan Taman', 'jenis', '5.3'),
('5.3.4.01', '5 3 4 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.4'),
('5.3.4.02', '5 3 4 02', 'Belanja Modal Upah Tenaga Kerja', 'objek', '5.3.4'),
('5.3.4.03', '5 3 4 03', 'Belanja Modal Bahan Baku', 'objek', '5.3.4'),
('5.3.4.04', '5 3 4 04', 'Belanja Modal Sewa Peralatan', 'objek', '5.3.4'),
('5.3.5', '5 3 5', 'Belanja Modal Jalan/Prasarana Jalan', 'jenis', '5.3'),
('5.3.5.01', '5 3 5 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.5'),
('5.3.5.02', '5 3 5 02', 'Belanja Modal Upah Tenaga Kerja', 'objek', '5.3.5'),
('5.3.5.03', '5 3 5 03', 'Belanja Modal Bahan Baku', 'objek', '5.3.5'),
('5.3.5.04', '5 3 5 04', 'Belanja Modal Sewa Peralatan', 'objek', '5.3.5'),
('5.3.6', '5 3 6', 'Belanja Modal Jembatan', 'jenis', '5.3'),
('5.3.6.01', '5 3 6 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.6'),
('5.3.6.02', '5 3 6 02', 'Belanja Modal Upah Tenaga Kerja', 'objek', '5.3.6'),
('5.3.6.03', '5 3 6 03', 'Belanja Modal Bahan Baku', 'objek', '5.3.6'),
('5.3.6.04', '5 3 6 04', 'Belanja Modal Sewa Peralatan', 'objek', '5.3.6'),
('5.3.7', '5 3 7', 'Belanja Modal Irigasi/Embung/Air Sungai/Drainase/Air Limbah/Persampahan', 'jenis', '5.3'),
('5.3.7.01', '5 3 7 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.7'),
('5.3.7.02', '5 3 7 02', 'Belanja Modal Upah Tenaga Kerja', 'objek', '5.3.7'),
('5.3.7.03', '5 3 7 03', 'Belanja Modal Bahan Baku', 'objek', '5.3.7'),
('5.3.7.04', '5 3 7 04', 'Belanja Modal Sewa Peralatan', 'objek', '5.3.7'),
('5.3.8', '5 3 8', 'Belanja Modal Jaringan/Instalasi', 'jenis', '5.3'),
('5.3.8.01', '5 3 8 01', 'Belanja Modal Honor Tim yang Melaksanakan Kegiatan', 'objek', '5.3.8'),
('5.3.8.02', '5 3 8 02', 'Belanja Modal Upah Tenaga Kerja', 'objek', '5.3.8'),
('5.3.8.03', '5 3 8 03', 'Belanja Modal Bahan Baku', 'objek', '5.3.8'),
('5.3.8.04', '5 3 8 04', 'Belanja Modal Sewa Peralatan', 'objek', '5.3.8'),
('5.3.9', '5 3 9', 'Belanja Modal lainnya', 'jenis', '5.3'),
('5.3.9.01', '5 3 9 01', 'Belanja Modal khusus Pendidikan dan Perpustakaan', 'objek', '5.3.9'),
('5.3.9.02', '5 3 9 02', 'Belanja Modal khusus Olahraga', 'objek', '5.3.9'),
('5.3.9.03', '5 3 9 03', 'Belanja Modal khusus Kesenian/Kebudayaan/keagamaan', 'objek', '5.3.9'),
('5.3.9.04', '5 3 9 04', 'Belanja Modal Tumbuhan/Tanaman', 'objek', '5.3.9'),
('5.3.9.05', '5 3 9 05', 'Belanja Modal Hewan', 'objek', '5.3.9'),
('5.3.9.90', '5 3 9 90-99', 'Belanja Modal Lainnya', 'objek', '5.3.9'),

-- KELOMPOK 5.4: Belanja Tak Terduga
('5.4', '5 4', 'Belanja Tak Terduga', 'kelompok', '5'),
('5.4.1', '5 4 1', 'Belanja Tak Terduga', 'jenis', '5.4'),
('5.4.1.01', '5 4 1 01', 'Belanja Tak Terduga', 'objek', '5.4.1'),

-- AKUN 6: PEMBIAYAAN
('6', '6', 'PEMBIAYAAN', 'akun', NULL),

-- KELOMPOK 6.1: Penerimaan Pembiayaan
('6.1', '6 1', 'Penerimaan Pembiayaan', 'kelompok', '6'),
('6.1.1', '6 1 1', 'SILPA Tahun Sebelumya', 'jenis', '6.1'),
('6.1.1.01', '6 1 1 01', 'SILPA Tahun Sebelumnya', 'objek', '6.1.1'),
('6.1.2', '6 1 2', 'Pencairan Dana Cadangan', 'jenis', '6.1'),
('6.1.2.01', '6 1 2 01', 'Pencairan Dana Cadangan', 'objek', '6.1.2'),
('6.1.3', '6 1 3', 'Hasil Penjualan Kekayaan Desa yang Dipisahkan', 'jenis', '6.1'),
('6.1.3.01', '6 1 3 01', 'Hasil Penjualan Kekayaan Desa yang Dipisahkan', 'objek', '6.1.3'),
('6.1.9', '6 1 9', 'Penerimaan Pembiayaan Lainnya', 'jenis', '6.1'),
('6.1.9.90', '6 1 9 90-99', 'Penerimaan Pembiayaan Lainnya', 'objek', '6.1.9'),

-- KELOMPOK 6.2: Pengeluaran Pembiayaan
('6.2', '6 2', 'Pengeluaran Pembiayaan', 'kelompok', '6'),
('6.2.1', '6 2 1', 'Pembentukan Dana Cadangan', 'jenis', '6.2'),
('6.2.1.01', '6 2 1 01', 'Pembentukan Dana Cadangan', 'objek', '6.2.1'),
('6.2.2', '6 2 2', 'Penyertaan Modal Desa', 'jenis', '6.2'),
('6.2.2.01', '6 2 2 01', 'Penyertaan Modal Desa', 'objek', '6.2.2'),
('6.2.9', '6 2 9', 'Pengeluaran Pembiayaan lainnya', 'jenis', '6.2'),
('6.2.9.90', '6 2 9 90-99', 'Pengeluaran Pembiayaan lainnya', 'objek', '6.2.9')
ON CONFLICT (id) DO NOTHING;

COMMIT;
