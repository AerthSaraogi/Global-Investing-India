import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div>
      <Header />
      <main style={{ maxWidth: '900px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          Privacy Policy and Data Security
        </h1>

        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', lineHeight: 1.7 }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-emerald)' }}>
              Your Financial Data Stays Strictly on Your Device
            </h2>
            <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-secondary)' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                The Schedule FA tool and all calculators run 100% inside your local web browser. Files you open and numbers you enter are processed purely in ephemeral memory on your device.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                They are <strong>never sent to, saved on, logged by or mirrored to any server, backend API, or database</strong> that we or any service provider run.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                We do not store your financial data or parsed transactions in cookies, localStorage, sessionStorage, or IndexedDB. Closing or refreshing the tab clears all working data immediately.
              </li>
              <li>
                Calculator and upload pages contain <strong>no analytics, no tracking pixels, no advertising scripts, and no session-recording software</strong>.
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--accent-blue)' }}>
              DPDP Act, 2023 Compliance
            </h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              Under India’s Digital Personal Data Protection Act, 2023, our zero-retention, client-side execution model guarantees that your sensitive financial asset records never enter the custody of any data fiduciary or third-party server.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
