'use client';

import { useState } from 'react';
import './styles.css';

export default function BukuKasUmumPage() {
  const [expandedMonths, setExpandedMonths] = useState({ bulan2: true });

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const tableData = [
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
    {
      no: '1',
      tanggal: '22/4/09',
      kodeRekening: '1.1.2',
      uraian: 'Saldo Masuk',
      pemasukan: '4.000,00',
      pengeluaran: '5.000,00',
      noBukti: '12',
      nettoTransaksi: '9.000,00',
      saldo: '10,000',
    },
  ];

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

      <main className="main-content">
        <div className="breadcrumb">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <g clipPath="url(#clip0_7759_2480)">
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
              <clipPath id="clip0_7759_2480">
                <rect width="12" height="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div className="breadcrumb-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2.33337 11.3748C2.33337 10.9881 2.48702 10.6171 2.76051 10.3436C3.034 10.0701 3.40493 9.9165 3.79171 9.9165H11.6667M2.33337 11.3748C2.33337 11.7616 2.48702 12.1325 2.76051 12.406C3.034 12.6795 3.40493 12.8332 3.79171 12.8332H11.6667V1.1665H3.79171C3.40493 1.1665 3.034 1.32015 2.76051 1.59364C2.48702 1.86713 2.33337 2.23806 2.33337 2.62484V11.3748Z"
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

        <div className="page-container">
          <div className="page-header">
            <div className="header-content">
              <h1 className="page-title">Buku Kas Umum</h1>
              <p className="page-subtitle">Buku Kas Umum Pemerintah Desa BANGUNTAPAN Tahun Anggaran 2025</p>
            </div>
            <div className="header-actions">
              <button className="btn-orange">
                Unduh File
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M17.5 13V16.3333C17.5 16.7754 17.3244 17.1993 17.0118 17.5118C16.6993 17.8244 16.2754 18 15.8333 18H4.16667C3.72464 18 3.30072 17.8244 2.98816 17.5118C2.67559 17.1993 2.5 16.7754 2.5 16.3333V13M5.83333 8.83333L10 13M10 13L14.1667 8.83333M10 13V3"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="btn-green">
                Input Data
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path
                    d="M10 4.6665V16.3332M4.16669 10.4998H15.8334"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="input-field">
            <label className="input-label">Tanggal</label>
            <div className="input-wrapper">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M13.3333 1.6665V4.99984M6.66667 1.6665V4.99984M2.5 8.33317H17.5M4.16667 3.33317H15.8333C16.7538 3.33317 17.5 4.07936 17.5 4.99984V16.6665C17.5 17.587 16.7538 18.3332 15.8333 18.3332H4.16667C3.24619 18.3332 2.5 17.587 2.5 16.6665V4.99984C2.5 4.07936 3.24619 3.33317 4.16667 3.33317Z"
                  stroke="#71717A"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input type="text" placeholder="DD/MM/YYYY" className="date-input" />
            </div>
          </div>

          <div className="months-container">
            <div className="month-section">
              <div className="month-header">
                <div className="month-title">
                  <button onClick={() => toggleMonth('bulan2')} className="chevron-btn">
                    {expandedMonths.bulan2 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span>Bulan 2</span>
                </div>
                <div className="month-total">
                  <span className="total-label">Saldo Total</span>
                  <span className="total-amount">Rp1.500.000.000,00</span>
                </div>
                <div className="month-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.99998 3.3335V12.6668M3.33331 8.00016H12.6666"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="month-section expanded">
              <div className="month-header">
                <div className="month-title">
                  <button onClick={() => toggleMonth('bulan1')} className="chevron-btn">
                    {expandedMonths.bulan1 ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <span>Bulan 1</span>
                </div>
                <div className="month-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">Rp1.500.000.000,00</span>
                </div>
                <div className="month-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.99998 3.3335V12.6668M3.33331 8.00016H12.6666"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {expandedMonths.bulan1 && (
                <div className="table-container">
                  <div className="table-header">
                    <div>No</div>
                    <div>Tanggal</div>
                    <div>Kode Rekening</div>
                    <div>Uraian</div>
                    <div>Pemasukan</div>
                    <div>Pengeluaran</div>
                    <div>No. Bukti</div>
                    <div>Netto Transaksi</div>
                    <div>Saldo</div>
                    <div>Edit</div>
                  </div>
                  {tableData.map((row, index) => (
                    <div key={index} className="table-row">
                      <div>{row.no}</div>
                      <div>{row.tanggal}</div>
                      <div>{row.kodeRekening}</div>
                      <div>{row.uraian}</div>
                      <div>{row.pemasukan}</div>
                      <div>{row.pengeluaran}</div>
                      <div>{row.noBukti}</div>
                      <div>{row.nettoTransaksi}</div>
                      <div>{row.saldo}</div>
                      <div className="edit-icon">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none">
                          <path
                            d="M8 13.8332H14M11 2.83316C11.2652 2.56794 11.6249 2.41895 12 2.41895C12.1857 2.41895 12.3696 2.45553 12.5412 2.5266C12.7128 2.59767 12.8687 2.70184 13 2.83316C13.1313 2.96448 13.2355 3.12038 13.3066 3.29196C13.3776 3.46354 13.4142 3.64744 13.4142 3.83316C13.4142 4.01888 13.3776 4.20277 13.3066 4.37436C13.2355 4.54594 13.1313 4.70184 13 4.83316L4.66667 13.1665L2 13.8332L2.66667 11.1665L11 2.83316Z"
                            stroke="#121926"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="month-section">
              <div className="month-header">
                <div className="month-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bulan 1</span>
                </div>
                <div className="month-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">Rp1.500.000.000,00</span>
                </div>
                <div className="month-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.99998 3.33301V12.6663M3.33331 7.99967H12.6666"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="month-section">
              <div className="month-header">
                <div className="month-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bulan 1</span>
                </div>
                <div className="month-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">Rp1.500.000.000,00</span>
                </div>
                <div className="month-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.99998 3.33301V12.6663M3.33331 7.99967H12.6666"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="month-section">
              <div className="month-header">
                <div className="month-title">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="#121926" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bulan 1</span>
                </div>
                <div className="month-total">
                  <span className="total-label">Total</span>
                  <span className="total-amount">Rp1.500.000.000,00</span>
                </div>
                <div className="month-actions">
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10M4.66667 6.66667L8 10M8 10L11.3333 6.66667M8 10V2"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <button className="action-btn">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M7.99998 3.33301V12.6663M3.33331 7.99967H12.6666"
                        stroke="#364152"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
