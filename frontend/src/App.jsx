import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Create from './pages/Home/Create'
import Show from './pages/Show/Show'
import { ToastProvider } from './contexts/ToastContext'
import ToastList from '@/components/Toast/ToastList'
import TopHeader from '@/components/TopHeader/TopHeader'
import Footer from '@/components/Footer/Footer'

function App() {
  return (

    <BrowserRouter>
      <ToastProvider>
        <ToastList />

        <TopHeader />

        <Routes>
          <Route path="/" element={<Create />}/>
          <Route path="/:id" element={<Show />}/>
        </Routes>

        <Footer />
      </ToastProvider>
    </BrowserRouter>

  )
}

export default App
