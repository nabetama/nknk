import './assets/main.css'

import { StrictMode } from 'react'
import type React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Post from './Post'
import { HashRouter, Routes, Route } from 'react-router-dom'

export default function Router(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </HashRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
