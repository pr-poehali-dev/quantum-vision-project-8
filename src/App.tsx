import { useState, useEffect } from "react"
import { LinkBioPage } from "./pages/LinkBioPage"
import { AuthDrawer } from "./components/AuthDrawer"

const AUTH_URL = "https://functions.poehali.dev/498d74c9-8962-4ad2-b806-0c7bf1b23051"

function App() {
  const [authed, setAuthed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("rb_token")
    if (!token) return
    fetch(`${AUTH_URL}?action=verify`, { headers: { "X-Session-Token": token } })
      .then((r) => { if (r.ok) setAuthed(true) })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("rb_token")
    localStorage.removeItem("rb_email")
    setAuthed(false)
    setDrawerOpen(false)
  }

  return (
    <>
      <LinkBioPage authed={authed} onLogout={handleLogout} />
      <AuthDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onOpen={() => setDrawerOpen(true)}
        authed={authed}
        onSuccess={() => { setAuthed(true); setDrawerOpen(false) }}
        onLogout={handleLogout}
      />
    </>
  )
}

export default App
