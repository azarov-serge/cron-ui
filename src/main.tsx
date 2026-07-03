import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FontsVTBGroup, DropdownProvider } from '@admiral-ds/react-ui'
import { AppThemeProvider } from '@shared/providers/AppThemeProvider'
import { LocaleProvider } from '@shared/providers/LocaleProvider'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppThemeProvider>
      <LocaleProvider>
        <DropdownProvider>
          <FontsVTBGroup />
          <App />
        </DropdownProvider>
      </LocaleProvider>
    </AppThemeProvider>
  </StrictMode>,
)
