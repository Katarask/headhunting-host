import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import CostOfVacancyPage from './CostOfVacancyPage.jsx'
import ActiveSourcingPage from './ActiveSourcingPage.jsx'
import ContactPage from './ContactPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/cost-of-vacancy" element={<CostOfVacancyPage />} />
        <Route path="/active-sourcing" element={<ActiveSourcingPage />} />
        <Route path="/kontakt" element={<ContactPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
