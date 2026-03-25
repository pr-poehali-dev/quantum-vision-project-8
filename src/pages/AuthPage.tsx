import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Eye, EyeOff } from "lucide-react"
import Icon from "@/components/ui/icon"

const AUTH_URL = "https://functions.poehali.dev/498d74c9-8962-4ad2-b806-0c7bf1b23051"

interface AuthPageProps {
  onSuccess: (email: string, token: string) => void
}

export function AuthPage({ onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const action = mode
    const body: Record<string, string> = { email, password }
    if (mode === "register") body.birth_date = birthDate

    const res = await fetch(`${AUTH_URL}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || "Произошла ошибка")
      return
    }

    localStorage.setItem("rb_token", data.token)
    localStorage.setItem("rb_email", data.email)
    onSuccess(data.email, data.token)
  }

  const glassStyle = {
    background: "rgba(255, 255, 255, 0.07)",
    backdropFilter: "blur(40px) saturate(180%)",
    WebkitBackdropFilter: "blur(40px) saturate(180%)",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "inset 0 1px 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)",
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-black">
      {/* Orbs */}
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(239,68,68,0.2) 0%, transparent 70%)", filter: "blur(80px)", top: "-10%", left: "-10%" }}
        animate={{ x: [0, 80, 0], y: [0, 60, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="fixed z-0 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)", filter: "blur(80px)", bottom: "-10%", right: "-10%" }}
        animate={{ x: [0, -80, 0], y: [0, -60, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative z-10 w-full max-w-[360px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img
            src="https://cdn.poehali.dev/projects/905a50a9-4862-48fe-a0d2-1af86d635064/bucket/1f3bf671-8d8a-43c6-898e-8488b2808537.jpg"
            alt="Ru Browser"
            className="w-32 h-auto"
            style={{ mixBlendMode: "lighten" }}
          />
        </div>

        {/* Card */}
        <div className="rounded-3xl p-6" style={glassStyle}>
          {/* Tabs */}
          <div className="flex rounded-2xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.05)" }}>
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError("") }}
                className="flex-1 py-2 rounded-xl text-[13px] font-medium transition-all duration-200"
                style={mode === m ? {
                  background: "rgba(255,255,255,0.12)",
                  color: "white",
                } : { color: "rgba(255,255,255,0.4)" }}
              >
                {m === "login" ? "Вход" : "Регистрация"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-2xl px-4 py-3 text-[14px] text-white placeholder:text-gray-500 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl px-4 py-3 pr-12 text-[14px] text-white placeholder:text-gray-500 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <AnimatePresence>
              {mode === "register" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="mb-1">
                    <label className="text-[11px] text-gray-500 pl-1">Дата рождения (18+ для доступа)</label>
                  </div>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    required={mode === "register"}
                    className="w-full rounded-2xl px-4 py-3 text-[14px] text-white outline-none"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      colorScheme: "dark",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[13px] text-red-400 text-center px-2"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl py-3 text-[14px] font-semibold text-white mt-1 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(59,130,246,0.8))" }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-4">
          Доступ только для лиц старше 18 лет
        </p>
      </motion.div>
    </main>
  )
}
