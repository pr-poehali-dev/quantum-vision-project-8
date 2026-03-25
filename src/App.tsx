import { useState, useEffect } from "react"
import { LinkBioPage } from "./pages/LinkBioPage"
import { AuthPage } from "./pages/AuthPage"

const AUTH_URL = "https://functions.poehali.dev/498d74c9-8962-4ad2-b806-0c7bf1b23051"

function App() {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("rb_token")
    if (!token) { setChecking(false); return }

    fetch(`${AUTH_URL}?action=verify`, {
      headers: { "X-Session-Token": token },
    })
      .then((r) => { if (r.ok) setAuthed(true) })
      .finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
    </div>
  )

  if (!authed) return (
    <AuthPage onSuccess={() => setAuthed(true)} />
  )

  return <LinkBioPage />
}

export default App
