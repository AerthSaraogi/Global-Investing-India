'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import fundsData from '../../../data/funds.json';
import { Table, Search, Filter, ExternalLink, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export default function FundsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const funds = fundsData.funds;

  const filteredFunds = funds.filter((fund) => {
    const matchesSearch =
      fund.fund_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.amc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fund.underlying_exposure.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || fund.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || fund.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '2rem auto', padding: '0 1.5rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-blue)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Table size={14} /> Module 3: Fund Availability Matrix
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            International Fund & ETF Subscription Status
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '850px', fontSize: '1rem' }}>
            Track which mutual fund schemes and international ETFs are open for lump-sum or fresh SIP subscriptions under RBI & SEBI overseas investment industry caps.
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            Table updated as of: <strong>{fundsData.last_updated}</strong> • Source: Direct AMC notices and exchange filings.
          </div>
        </div>

        {/* Filter Controls */}
        <div className="glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 250px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search scheme name, AMC or index..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '2.25rem' }}
            />
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="all">All Vehicle Types</option>
              <option value="etf">Exchange Traded Fund (ETF)</option>
              <option value="fof">Fund of Funds (FoF)</option>
              <option value="gift_city">GIFT City Fund</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
              style={{ width: 'auto', cursor: 'pointer' }}
            >
              <option value="all">All Statuses</option>
              <option value="open">Fully Open</option>
              <option value="limited">Limited (Per-PAN cap)</option>
              <option value="closed_new_sips">Closed for New SIPs</option>
              <option value="closed_all">Completely Closed</option>
            </select>
          </div>
        </div>

        {/* Fund Table */}
        <div className="glass-panel" style={{ overflowX: 'auto', padding: '0.5rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Scheme Name & AMC</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Underlying Exposure</th>
                <th style={{ padding: '1rem' }}>Lump Sum</th>
                <th style={{ padding: '1rem' }}>Fresh SIP</th>
                <th style={{ padding: '1rem' }}>Per-PAN Limit</th>
                <th style={{ padding: '1rem' }}>Status As Of</th>
                <th style={{ padding: '1rem' }}>Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredFunds.map((fund) => {
                const isOpen = fund.status === 'open';
                const isLimited = fund.status === 'limited';

                return (
                  <tr key={fund.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>
                      <div>{fund.fund_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fund.amc}</div>
                    </td>
                    <td style={{ padding: '1rem', textTransform: 'uppercase', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      {fund.type}
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                      {fund.underlying_exposure}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={fund.lump_sum === 'open' ? 'badge-verified' : 'badge-pending'}>
                        {fund.lump_sum === 'open' ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span className={fund.new_sip === 'open' ? 'badge-verified' : 'badge-pending'}>
                        {fund.new_sip === 'open' ? 'Open' : 'Closed'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', color: isLimited ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                      {fund.per_pan_limit_inr ? `₹${fund.per_pan_limit_inr.toLocaleString('en-IN')}/${fund.limit_period}` : 'No cap'}
                    </td>
                    <td style={{ padding: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {fund.status_as_of}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <a
                        href={fund.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}
                      >
                        Notice <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </main>
      <Footer />
    </div>
  );
}
