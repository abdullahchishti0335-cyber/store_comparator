export const metadata = {
  title: 'PriceWise - Price Comparator',
  description: 'Compare prices across stores',
  icons: {
    icon: '/site-logo.svg', // hello
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin: 0, padding: 0}}>{children}</body>
    </html>
  )
}