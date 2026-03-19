import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Za hokejem do Švýcar | Kaufland soutěž",
  description:
    "Nastupte na palubu a leťte na hokej! Soutěžte s Kauflandem o zájezd do Švýcarska a další ceny.",
  openGraph: {
    title: "Za hokejem do Švýcar | Kaufland soutěž",
    description:
      "Nastupte na palubu a leťte na hokej! Soutěžte s Kauflandem o zájezd do Švýcarska.",
    url: "https://www.zahokejemdosvycar.cz",
    siteName: "Za hokejem do Švýcar",
    locale: "cs_CZ",
    type: "website",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="cs">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
