import { createRoot } from 'react-dom/client'
import AppRouter from "./routes/AppRouter.jsx"
import './index.css'
import Toast from './components/Toast/Toast.jsx'


createRoot(document.getElementById('root')).render(
  <>
    <AppRouter />
    <Toast />
  </>
)