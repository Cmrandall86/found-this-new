import React from 'react'
import { Inter, Righteous } from 'next/font/google'
import '../../styles/globals.css'

const inter = Inter({ subsets: ['latin'] })
const righteous = Righteous({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Curated Finds',
  description: 'Discover hand-picked products worth sharing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --header-font: ${righteous.style.fontFamily};
            --body-font: ${inter.style.fontFamily};
          }
        `}</style>
      </head>
      <body className={inter.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
