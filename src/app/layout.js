import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from "@/lib/supabase/server";


export const metadata = {
  title: 'Celestial Art Exhibition',
  description: 'Pameran digital bertema Fairytale – Alam, Fiksi, Mitologi, Kastil, dan Fairy',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gradient-to-b from-[#0e0e2c] to-[#1b1b3a] text-white">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

