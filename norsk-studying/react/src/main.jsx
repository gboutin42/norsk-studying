import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router.jsx'
import { CssBaseline } from '@mui/material'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import { SnackbarProvider } from 'notistack'

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <SnackbarProvider maxSnack={3} >
            <ContextProvider>
                <CssBaseline />
                <RouterProvider router={router} />
            </ContextProvider>
        </SnackbarProvider>
    </StrictMode>
)
