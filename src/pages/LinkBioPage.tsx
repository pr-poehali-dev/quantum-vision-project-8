import { useState } from "react"
import { motion } from "framer-motion"
import { SocialFooter } from "@/components/SocialFooter"
import { Search, Mail, Send, Globe } from "lucide-react"

const quickLinks = [
  { label: "Новости", href: "https://www.google.com/search?q=новости" },
  { label: "Погода", href: "https://www.google.com/search?q=погода" },
  { label: "Переводчик", href: "https://translate.google.com" },
  { label: "Карты", href: "https://maps.google.com" },
]

const socials = [
  { icon: Send, href: "#", label: "Telegram" },
  { icon: Mail, href: "#", label: "Email" },
  { icon: Globe, href: "#", label: "Сайт" },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 350, damping: 25 },
  },
}

export function LinkBioPage() {
  const [query, setQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank")
    }
  }

  return (
    <main className="relative min-h-screen px-6 py-10 flex flex-col overflow-hidden">
      <div className="fixed inset-0 z-0 bg-black" />

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed z-0 w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.25) 0%, transparent 70%)",
          filter: "blur(60px)",
          top: "-10%",
          left: "-10%",
        }}
        animate={{ x: [0, 100, 50, 0], y: [0, 50, 100, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed z-0 w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
          filter: "blur(80px)",
          top: "30%",
          right: "-20%",
        }}
        animate={{ x: [0, -80, -40, 0], y: [0, 80, -40, 0], scale: [1, 0.85, 1.15, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed z-0 w-[450px] h-[450px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
          filter: "blur(70px)",
          bottom: "-5%",
          left: "20%",
        }}
        animate={{ x: [0, 60, -30, 0], y: [0, -60, 30, 0], scale: [1, 1.1, 0.95, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Noise texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 mx-auto max-w-[480px] w-full flex flex-col flex-1 justify-between"
      >
        <div className="flex flex-col items-center gap-10 pt-4">
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <img
              src="https://cdn.poehali.dev/projects/905a50a9-4862-48fe-a0d2-1af86d635064/bucket/1f3bf671-8d8a-43c6-898e-8488b2808537.jpg"
              alt="Ru Browser"
              className="w-48 h-auto object-contain rounded-2xl"
              style={{
                filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.10))",
              }}
            />
          </motion.div>

          {/* Search bar */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSearch}
            className="w-full relative"
          >
            <div
              className="flex items-center gap-3 w-full rounded-[24px] px-5 py-4"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(40px) saturate(180%)",
                WebkitBackdropFilter: "blur(40px) saturate(180%)",
                boxShadow: `
                  inset 0 1px 1px rgba(255, 255, 255, 0.1),
                  0 0 0 1px rgba(255, 255, 255, 0.12),
                  0 8px 32px rgba(0, 0, 0, 0.3)
                `,
                border: "1px solid rgba(255, 255, 255, 0.12)",
              }}
            >
              <Search className="h-5 w-5 text-gray-400 shrink-0" strokeWidth={1.75} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти что угодно..."
                className="flex-1 bg-transparent outline-none text-[15px] text-white placeholder:text-gray-500"
                autoFocus
              />
              {query && (
                <motion.button
                  type="submit"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full text-white"
                  style={{
                    background: "linear-gradient(135deg, rgba(147,51,234,0.85), rgba(236,72,153,0.85))",
                  }}
                >
                  <Search className="h-4 w-4" strokeWidth={2} />
                </motion.button>
              )}
            </div>
          </motion.form>

          {/* Quick links tiles */}
          <motion.div variants={itemVariants} className="w-full grid grid-cols-4 gap-3">
            {quickLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center aspect-square rounded-2xl text-[12px] font-medium text-gray-300"
                style={{
                  background: "rgba(255, 255, 255, 0.07)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                whileHover={{ scale: 1.06, y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 500, damping: 25 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="pb-2 pt-10">
          <SocialFooter socials={socials} copyright="2026 Ru Browser" />
        </motion.div>
      </motion.div>
    </main>
  )
}