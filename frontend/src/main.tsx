import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './index.css'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import AlgorithmBuilder from './pages/AlgorithmBuilder'
import RegexBuilderPage from './pages/RegexBuilderPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="algorithm-builder" element={<AlgorithmBuilder />} />
          <Route path="regex-builder" element={<RegexBuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
