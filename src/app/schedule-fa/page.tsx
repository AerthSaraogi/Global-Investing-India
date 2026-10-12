'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { BrokerTransaction, processScheduleFA, ScheduleFARow } from '@/lib/schedule-fa-engine';
import { UploadCloud, FileSpreadsheet, Download, ShieldCheck, AlertCircle, FileText } from 'lucide-react';

export default function ScheduleFAPage() {
  const [calendarYear, setCalendarYear] = useState('2025');
  const [transactions, setTransactions] = useState<BrokerTransaction[]>([]);
  const [peakInputs, setPeakInputs] = useState<Record<string, number>>({});
  const [closingPrices, setClosingPrices] = useState<Record<string, number>>({});
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage(`Parsing ${file.name} strictly in browser memory...`);

    if (file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsed: BrokerTransaction[] = (results.data as any[]).map((row) => ({
            date: row.date || row.Date || '',
            type: (row.type || row.Type || 'buy').toLowerCase(),
            symbol: row.symbol || row.Symbol || 'UNKNOWN',
            quantity: Number(row.quantity || row.Quantity || 0),
            price_usd: Number(row.price_usd || row.Price || 0),
            amount_usd: Number(row.amount_usd || row.Amount || 0),
            fees_usd: Number(row.fees_usd || row.Fees || 0),
          })).filter(t => t.date && t.symbol !== 'UNKNOWN');

          setTransactions(parsed);
          setStatusMessage(`Successfully loaded ${parsed.length} transactions in local memory.`);
        },
        error: (err) => {
          setStatusMessage(`Failed to read CSV: ${err.message}`);
        }
      });
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsed: BrokerTransaction[] = json.map((row) => ({
          date: String(row.date || row.Date || ''),
          type: String(row.type || row.Type || 'buy').toLowerCase() as any,
          symbol: String(row.symbol || row.Symbol || 'UNKNOWN'),
          quantity: Number(row.quantity || row.Quantity || 0),
          price_usd: Number(row.price_usd || row.Price || 0),
          amount_usd: Number(row.amount_usd || row.Amount || 0),
          fees_usd: Number(row.fees_usd || row.Fees || 0),
        })).filter(t => t.date && t.symbol !== 'UNKNOWN');

        setTransactions(parsed);
        setStatusMessage(`Successfully loaded ${parsed.length} transactions from XLSX.`);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleDownloadSample = () => {
    const sampleCsv = `date,type,symbol,quantity,price_usd,amount_usd,fees_usd\n2025-03-10,buy,AAPL,10,180.00,1800.00,0.00\n2025-06-15,dividend,AAPL,,,15.00,0.00\n2025-09-20,sell,AAPL,4,220.00,880.00,0.00\n2025-04-12,buy,MSFT,5,400.00,2000.00,0.00`;
    const blob = new Blob([sampleCsv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'standard_schedule_fa_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const worksheetRows: ScheduleFARow[] = processScheduleFA(transactions, peakInputs, closingPrices);

  const handleExportXLSX = () => {
    if (worksheetRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(worksheetRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Schedule_FA_${calendarYear}`);
    XLSX.writeFile(wb, `Schedule_FA_${calendarYear}_Worksheet.xlsx`);
  };

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <FileSpreadsheet size={14} /> Module 4: Schedule FA Worksheet
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            ITR Schedule FA Foreign Asset Worksheet Generator
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '1rem' }}>
            Generate the calendar-year foreign equity holdings table for ITR-2 / ITR-3. 
            All parsing and calculations occur <strong>100% inside your browser</strong>. No file data is ever transmitted over the network or stored in browser storage.
          </p>
        </div>

        {/* Upload & Setup Bar */}
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Reporting Calendar Year
                </label>
                <select
                  value={calendarYear}
                  onChange={(e) => setCalendarYear(e.target.value)}
                  className="input-field"
                  style={{ width: '130px', cursor: 'pointer' }}
                >
                  <option value="2025">CY 2025</option>
                  <option value="2024">CY 2024</option>
                  <option value="2023">CY 2023</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                  Upload Broker Statement (CSV/XLSX)
                </label>
                <input
                  type="file"
                  accept=".csv, .xlsx, .xls"
                  onChange={handleFileUpload}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleDownloadSample} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                <FileText size={14} /> Download CSV Template
              </button>
              {worksheetRows.length > 0 && (
                <button onClick={handleExportXLSX} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <Download size={14} /> Export to XLSX
                </button>
              )}
            </div>

          </div>

          {statusMessage && (
            <div style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--accent-cyan)' }}>
              {statusMessage}
            </div>
          )}
        </div>

        {/* Worksheet Table */}
        {worksheetRows.length > 0 ? (
          <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Table A3: Foreign Equity & Debt Holdings (Calendar Year {calendarYear})
            </h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.75rem' }}>Country</th>
                  <th style={{ padding: '0.75rem' }}>Entity Name</th>
                  <th style={{ padding: '0.75rem' }}>Acquisition Date</th>
                  <th style={{ padding: '0.75rem' }}>Initial Value (INR)</th>
                  <th style={{ padding: '0.75rem' }}>Peak Value (INR)*</th>
                  <th style={{ padding: '0.75rem' }}>Closing Value (INR)</th>
                  <th style={{ padding: '0.75rem' }}>Total Proceeds (INR)</th>
                </tr>
              </thead>
              <tbody>
                {worksheetRows.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.75rem' }}>{row.countryName} ({row.countryCode})</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>{row.entityName}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{row.dateOfAcquisition}</td>
                    <td style={{ padding: '0.75rem' }}>₹{row.initialValueINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <input
                        type="number"
                        placeholder={row.peakValueINR.toString()}
                        value={peakInputs[row.entityName.replace(' Inc.', '')] || ''}
                        onChange={(e) => {
                          const sym = row.entityName.replace(' Inc.', '');
                          setPeakInputs({ ...peakInputs, [sym]: Number(e.target.value) });
                        }}
                        className="input-field"
                        style={{ width: '120px', padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
                      />
                    </td>
                    <td style={{ padding: '0.75rem' }}>₹{row.closingValueINR.toLocaleString('en-IN')}</td>
                    <td style={{ padding: '0.75rem', color: 'var(--accent-emerald)' }}>₹{row.grossProceedsINR.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              * Per Section 8.1 of Annexure A, brokers do not provide daily high marks. You may directly edit the Peak Value field above with your verified high portfolio value during the calendar year.
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <UploadCloud size={48} color="var(--accent-blue)" style={{ margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Statement Uploaded Yet</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem' }}>
              Download our standard CSV template or select your broker statement to generate the foreign asset reporting worksheet locally.
            </p>
            <button onClick={handleDownloadSample} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={14} /> Download Sample Template
            </button>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
