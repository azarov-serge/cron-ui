import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FontsVTBGroup, DropdownProvider } from '@admiral-ds/react-ui'
import { AppThemeProvider } from '@shared/providers/AppThemeProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <DropdownProvider>
        <FontsVTBGroup />
        <App />
      </DropdownProvider>
    </AppThemeProvider>
  </StrictMode>,
)
