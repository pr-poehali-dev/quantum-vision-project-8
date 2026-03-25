import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, X, Eye, EyeOff, LogOut, User } from "lucide-react"

const AUTH_URL = "https://functions.poehali.dev/498d74c9-8962-4ad2-b806-0c7bf1b23051"

interface AuthDrawerProps {
  open: boolean
  onClose: () => void
  onOpen: () => void
  authed: boolean
  onSuccess: () => void
  onLogout: () => void
}

export function AuthDrawer({ open, onClose, onOpen, authed, onSuccess, onLogout }: AuthDrawerProps) {
  const [mode, setMode] = useState<"login" | "register">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const userEmail = localStorage.getItem("rb_email") || ""

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const body: Record<string, string> = { email, password }
    if (mode === "register") body.birth_date = birthDate

    const res = await fetch(`${AUTH_URL}?action=${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || "Ошибка"); return }

    localStorage.setItem("rb_token", data.token)
    localStorage.setItem("rb_email", data.email)
    onSuccess()
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)",
  }

  return (
    <>
      {/* Trigger button — три точки */}
      <motion.button
        onClick={onOpen}
        className="fixed top-4 left-4 z-50 flex items-center justify-center w-9 h-9 rounded-full text-gray-400 hover:text-white transition-colors"
        style={{
          background: "rgba(255,255,255,0.07)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(20px)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
      >
        <MoreHorizontal size={18} />
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed top-0 left-0 z-50 h-full w-[300px] flex flex-col p-6"
            style={{
              background: "rgba(10,10,10,0.92)",
              backdropFilter: "blur(40px)",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <img
                src="https://cdn.poehali.dev/projects/905a50a9-4862-48fe-a0d2-1af86d635064/bucket/1f3bf671-8d8a-43c6-898e-8488b2808537.jpg"
                alt="Ru Browser"
                className="w-20 h-auto"
                style={{ mixBlendMode: "lighten" }}
              />
              <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {authed ? (
              /* Авторизован */
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.2)" }}>
                    <User size={14} className="text-red-400" />
                  </div>
                  <span className="text-[13px] text-gray-300 truncate">{userEmail}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[13px] text-red-400 transition-colors hover:bg-red-400/10"
                  style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                >
                  <LogOut size={14} />
                  Выйти из аккаунта
                </button>
              </div>
            ) : (
              /* Форма входа/регистрации */
              <>
                {/* Tabs */}
                <div className="flex rounded-2xl p-1 mb-5" style={{ background: "rgba(255,255,255,0.05)" }}>
                  {(["login", "register"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMode(m); setError("") }}
                      className="flex-1 py-2 rounded-xl text-[13px] font-medium transition-all"
                      style={mode === m
                        ? { background: "rgba(255,255,255,0.12)", color: "white" }
                        : { color: "rgba(255,255,255,0.35)" }}
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
                    className="w-full rounded-2xl px-4 py-3 text-[13px] text-white placeholder:text-gray-500 outline-none"
                    style={inputStyle}
                  />

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full rounded-2xl px-4 py-3 pr-11 text-[13px] text-white placeholder:text-gray-500 outline-none"
                      style={inputStyle}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  <AnimatePresence>
                    {mode === "register" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col gap-1"
                      >
                        <label className="text-[11px] text-gray-500 pl-1">Дата рождения (18+)</label>
                        <input
                          type="date"
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          required={mode === "register"}
                          className="w-full rounded-2xl px-4 py-3 text-[13px] text-white outline-none"
                          style={{ ...inputStyle, colorScheme: "dark" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[12px] text-red-400 text-center"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl py-3 text-[13px] font-semibold text-white mt-1 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.8), rgba(59,130,246,0.8))" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? "Подождите..." : mode === "login" ? "Войти" : "Зарегистрироваться"}
                  </motion.button>
                </form>

                <p className="text-[11px] text-gray-600 text-center mt-4">
                  Доступ только для лиц старше 18 лет
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
