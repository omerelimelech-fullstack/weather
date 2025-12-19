import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 1. מייבאים את המנהל של React Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 2. יוצרים מופע חדש של המנהל
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 3. עוטפים את האפליקציה בספק (Provider) כדי שכולם יוכלו להשתמש בו */}
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)