import React from 'react'
import { Inter, Righteous } from 'next/font/google'
import '../../styles/globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const righteous = Righteous({ 
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-righteous',
})

export const metadata = {
  title: 'Curated Finds',
  description: 'Discover hand-picked products worth sharing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${righteous.variable}`}>
      <body className={inter.className}>
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
