// Show which APIs are being used
{results?.meta?.scraperapiUsed && (
  <span style={{
    background: 'rgba(34,197,94,0.2)',
    color: '#4ade80',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700
  }}>
    ⚡ ScraperAPI Active
  </span>
)}

{results?.meta?.rapidapiUsed && (
  <span style={{
    background: 'rgba(59,130,246,0.2)',
    color: '#60a5fa',
    padding: '4px 12px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700,
    marginLeft: '8px'
  }}>
    🔌 RapidAPI Active
  </span>
)}