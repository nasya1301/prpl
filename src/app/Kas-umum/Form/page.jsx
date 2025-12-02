'use client';

import { useState } from 'react';
import './form-styles.css';

export default function FormInputKasUmum() {
  const [formData, setFormData] = useState({
    tanggal: '',
    kodeRek: '',
    bidang: '',
    subBidang: '',
    kegiatan: '',
    uraian: '',
    pemasukan: '',
    pengeluaran: '',
    nomorBukti: '',
    nettoTransaksi: '',
    buatLagi: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = () => {
    setFormData((prev) => ({ ...prev, buatLagi: !prev.buatLagi }));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="sidebar">
        <div className="sidebar-content">
          <div className="sidebar-main">
            <div className="user-section">
              <div className="user-info">
                <div className="user-role">Kepala Desa</div>
                <div className="user-village">Desa Banguntapan</div>
              </div>
              <div className="user-avatar"></div>
              <div className="user-details">
                <div className="user-name">Sudaryono</div>
                <div className="user-id">9232753828</div>
              </div>
            </div>

            <div className="sidebar-divider"></div>

            <nav className="nav-menu">
              <div className="nav-item">
                <div className="nav-item-label">Beranda</div>
              </div>

              <div className="nav-section">
                <div className="nav-item">
                  <svg className="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#FCFCFD" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="nav-item-label">APBDes</div>
                </div>
                <div className="nav-subitem">Draft APBDes</div>
                <div className="nav-subitem">Draft Penjabaran APBDes</div>
                <div className="nav-subitem">Buku APBDes</div>
              </div>

              <div className="nav-section">
                <div className="nav-item">
                  <svg className="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#FCFCFD" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="nav-item-label">Rencana & Kegiatan</div>
                </div>
                <div className="nav-subitem">Rencana Kegiatan dan Anggaran</div>
                <div className="nav-subitem">Rencana Kerja Kegiatan</div>
                <div className="nav-subitem">Rencana Anggaran Biaya</div>
              </div>

              <div className="nav-section">
                <div className="nav-item">
                  <svg className="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#FCFCFD" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="nav-item-label">Penatausahaan</div>
                </div>
                <div className="nav-subitem">Buku Kas Umum</div>
                <div className="nav-subitem">Buku Pembantu Pajak</div>
                <div className="nav-subitem">Buku Pembantu Panjar</div>
                <div className="nav-subitem">Buku Pembantu Kegiatan</div>
                <div className="nav-subitem">Buku Bank Desa</div>
              </div>

              <div className="nav-section">
                <div className="nav-item">
                  <svg className="chevron-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#FCFCFD" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="nav-item-label">Laporan Akhir</div>
                </div>
                <div className="nav-subitem">Laporan Realisasi Akhir Tahun</div>
              </div>
            </nav>
          </div>

          <button className="logout-btn">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M10 14H12.6667C13.0203 14 13.3594 13.8595 13.6095 13.6095C13.8595 13.3594 14 13.0203 14 12.6667V3.33333C14 2.97971 13.8595 2.64057 13.6095 2.39052C13.3594 2.14048 13.0203 2 12.6667 2H10M5.33333 11.3333L2 8M2 8L5.33333 4.66667M2 8H10"
                stroke="#121926"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      <main className="form-main-content">
        <div className="breadcrumb">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <g clipPath="url(#clip0_7765_2999)">
              <path
                d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z"
                stroke="#697586"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 7.5C6.82843 7.5 7.5 6.82843 7.5 6C7.5 5.17157 6.82843 4.5 6 4.5C5.17157 4.5 4.5 5.17157 4.5 6C4.5 6.82843 5.17157 7.5 6 7.5Z"
                stroke="#697586"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_7765_2999">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div className="breadcrumb-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.33333 11.3748C2.33333 10.9881 2.48697 10.6171 2.76046 10.3436C3.03395 10.0701 3.40489 9.9165 3.79166 9.9165H11.6667M2.33333 11.3748C2.33333 11.7616 2.48697 12.1325 2.76046 12.406C3.03395 12.6795 3.40489 12.8332 3.79166 12.8332H11.6667V1.1665H3.79166C3.40489 1.1665 3.03395 1.32015 2.76046 1.59364C2.48697 1.86713 2.33333 2.23806 2.33333 2.62484V11.3748Z"
                stroke="#121926"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Penatausahaan</span>
          </div>
          <svg width="29" height="18" viewBox="0 0 29 18" fill="none">
            <path d="M10.875 13.25L18.125 9L10.875 4.75" stroke="#121926" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="breadcrumb-item active">
            <span>Buku Kas Umum</span>
          </div>
        </div>

        <div className="form-container">
          <h1 className="form-title">Input Data Kas Umum</h1>

          <div className="form-sections">
            <div className="form-section">
              <h2 className="section-title">Detail </h2>

              <div className="form-field date-field">
                <label className="field-label">Tanggal</label>
                <div className="input-with-icon">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M13.3333 1.6665V4.99984M6.66667 1.6665V4.99984M2.5 8.33317H17.5M4.16667 3.33317H15.8333C16.7538 3.33317 17.5 4.07936 17.5 4.99984V16.6665C17.5 17.587 16.7538 18.3332 15.8333 18.3332H4.16667C3.24619 18.3332 2.5 17.587 2.5 16.6665V4.99984C2.5 4.07936 3.24619 3.33317 4.16667 3.33317Z"
                      stroke="#71717A"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <input
                    type="text"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Klasifikasi Bidang Kegiatan</label>
                <div className="classification-inputs">
                  <input
                    type="text"
                    name="kodeRek"
                    value={formData.kodeRek}
                    onChange={handleInputChange}
                    placeholder="Kode Rek"
                    className="form-input code-input"
                  />
                  <div className="select-wrapper">
                    <select name="bidang" value={formData.bidang} onChange={handleInputChange} className="form-select">
                      <option value="">Bidang</option>
                    </select>
                    <svg className="select-chevron" width="17" height="16" viewBox="0 0 17 16" fill="none">
                      <path
                        d="M4.33333 6L8.33333 10L12.3333 6"
                        stroke="#A1A1AA"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="select-wrapper">
                    <select
                      name="subBidang"
                      value={formData.subBidang}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Sub-Bidang</option>
                    </select>
                    <svg className="select-chevron" width="17" height="16" viewBox="0 0 17 16" fill="none">
                      <path
                        d="M4.66666 6L8.66666 10L12.6667 6"
                        stroke="#A1A1AA"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="select-wrapper">
                    <select
                      name="kegiatan"
                      value={formData.kegiatan}
                      onChange={handleInputChange}
                      className="form-select"
                    >
                      <option value="">Kegiatan</option>
                    </select>
                    <svg className="select-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 6L8 10L12 6"
                        stroke="#A1A1AA"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <input
                  type="text"
                  name="uraian"
                  value={formData.uraian}
                  onChange={handleInputChange}
                  placeholder="Uraian (Opsional)"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Arus Dana</h2>

              <div className="form-field">
                <label className="field-label">Pemasukan</label>
                <div className="input-with-prefix">
                  <div className="input-prefix">Rp</div>
                  <input
                    type="text"
                    name="pemasukan"
                    value={formData.pemasukan}
                    onChange={handleInputChange}
                    placeholder="0.000.000,00"
                    className="form-input-amount"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Pengeluaran</label>
                <div className="input-with-prefix">
                  <div className="input-prefix">Rp</div>
                  <input
                    type="text"
                    name="pengeluaran"
                    value={formData.pengeluaran}
                    onChange={handleInputChange}
                    placeholder="0.000.000,00"
                    className="form-input-amount"
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h2 className="section-title">Bukti dan Kumulatif</h2>

              <div className="form-field">
                <label className="field-label">Nomor Bukti</label>
                <div className="input-with-prefix">
                  <div className="input-prefix">No</div>
                  <input
                    type="text"
                    name="nomorBukti"
                    value={formData.nomorBukti}
                    onChange={handleInputChange}
                    placeholder="12345"
                    className="form-input-amount"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Netto Transaksi</label>
                <div className="input-with-prefix">
                  <div className="input-prefix">Rp</div>
                  <input
                    type="text"
                    name="nettoTransaksi"
                    value={formData.nettoTransaksi}
                    onChange={handleInputChange}
                    placeholder="0.000.000,00"
                    className="form-input-amount"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Saldo (Automated)</label>
            <div className="input-with-prefix">
              <div className="input-prefix">Rp</div>
              <input type="text" value="100.000.000,00" readOnly className="form-input-amount filled" />
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-delete">
              Hapus
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M2.5 5.00033H4.16667M4.16667 5.00033H17.5M4.16667 5.00033V16.667C4.16667 17.109 4.34226 17.5329 4.65482 17.8455C4.96738 18.1581 5.39131 18.3337 5.83333 18.3337H14.1667C14.6087 18.3337 15.0326 18.1581 15.3452 17.8455C15.6577 17.5329 15.8333 17.109 15.8333 16.667V5.00033H4.16667ZM6.66667 5.00033V3.33366C6.66667 2.89163 6.84226 2.46771 7.15482 2.15515C7.46738 1.84259 7.89131 1.66699 8.33333 1.66699H11.6667C12.1087 1.66699 12.5326 1.84259 12.8452 2.15515C13.1577 2.46771 13.3333 2.89163 13.3333 3.33366V5.00033M8.33333 9.16699V14.167M11.6667 9.16699V14.167"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="right-actions">
              <div className="toggle-section">
                <span className="toggle-label">Buat lagi</span>
                <button onClick={handleToggle} className="toggle-button">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path
                      d="M21.3333 6.66699H10.6667C5.51202 6.66699 1.33334 10.8457 1.33334 16.0003C1.33334 21.155 5.51202 25.3337 10.6667 25.3337H21.3333C26.488 25.3337 30.6667 21.155 30.6667 16.0003C30.6667 10.8457 26.488 6.66699 21.3333 6.66699Z"
                      stroke="#1E1E1E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.6667 20.0003C12.8758 20.0003 14.6667 18.2095 14.6667 16.0003C14.6667 13.7912 12.8758 12.0003 10.6667 12.0003C8.45754 12.0003 6.66668 13.7912 6.66668 16.0003C6.66668 18.2095 8.45754 20.0003 10.6667 20.0003Z"
                      stroke="#1E1E1E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <button className="btn-save">
                Simpan
                <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
                  <path
                    d="M14.6667 17.5V10.8333H6.33333V17.5M6.33333 2.5V6.66667H13M16.3333 17.5H4.66667C4.22464 17.5 3.80072 17.3244 3.48816 17.0118C3.17559 16.6993 3 16.2754 3 15.8333V4.16667C3 3.72464 3.17559 3.30072 3.48816 2.98816C3.80072 2.67559 4.22464 2.5 4.66667 2.5H13.8333L18 6.66667V15.8333C18 16.2754 17.8244 16.6993 17.5118 17.0118C17.1993 17.3244 16.7754 17.5 16.3333 17.5Z"
                    stroke="white"
                    strokeWidth="0.833333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
