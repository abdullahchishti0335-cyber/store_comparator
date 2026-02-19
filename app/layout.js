export const metadata = {
  title: 'PriceWise - Smart Price Comparator',
  description: 'Compare prices across multiple stores in real-time',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}