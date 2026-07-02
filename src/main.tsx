import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { MotionConfig } from 'framer-motion'
import './index.css'
import { TRPCProvider } from "@/providers/trpc"
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TRPCProvider>
        {/* reducedMotion="user": framer-motion animations collapse to simple
            opacity fades when the OS prefers reduced motion */}
        <MotionConfig reducedMotion="user">
          <App />
        </MotionConfig>
      </TRPCProvider>
    </BrowserRouter>
  </StrictMode>,
)
