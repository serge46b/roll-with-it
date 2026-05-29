import type { Metadata } from "next"
import localFont from "next/font/local"
import "@/app/globals.css"

const exo2 = localFont({
  src: "../../public/Exo2-VariableFont_wght.ttf",
  variable: "--font-exo2",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Roll with it",
  description: "Настольная RPG в браузере",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`${exo2.variable} ${exo2.className} antialiased`}>{children}</body>
    </html>
  )
}
