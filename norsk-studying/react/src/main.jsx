import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { CssBaseline } from '@mui/material'
import { ContextProvider } from './contexts/ContextProvider.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ContextProvider>
            <CssBaseline />
            <RouterProvider router={router} />
        </ContextProvider>
    </StrictMode>
)
