import './assets/main.css'

import { StrictMode } from 'react'
import type React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Post from './Post'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function Router(): React.JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/post" element={<Post />} />
      </Routes>
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router />
  </StrictMode>
)
