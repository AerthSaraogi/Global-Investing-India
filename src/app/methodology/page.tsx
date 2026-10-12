import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MethodologyPage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Methodology and Verification Policy
        </h1>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              What Each Verification Status Means
            </h2>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--accent-emerald)' }}>Verified (primary source):</strong> Checked against the statutory text of the Income-tax Act, Finance Act, Income-tax Rules, circulars or RBI notifications, linked directly beside each figure.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>Verified (secondary source):</strong> Confirmed against reputable published commentary and professional tax filings, pending gazette statutory verification.
              </li>
              <li>
                <strong style={{ color: 'var(--accent-amber)' }}>Pending verification:</strong> Awaiting professional confirmation. Marked with an explicit badge and should be used with extra caution.
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              Effective Dates & Revision Rhythm
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every rule and calculation shows the date it became effective and the date we last verified it against statutory amendments. Rules live in structured static data configurations separate from application code and are reviewed monthly and following every Union Budget, Finance Act, or relevant circular from the RBI or SEBI.
            </p>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              Known Limitations (Version 1)
            </h2>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              <li>Surcharge on high income earners (&gt; ₹50 Lakh) is not modelled in the base rate calculator.</li>
              <li>Capital losses are not set off against other gains in version 1.</li>
              <li>Results depend on user inputs and prevailing foreign exchange reference rates.</li>
              <li>We compare costs and explain statutory provisions; we do not provide personalized financial, legal, or investment advice.</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
