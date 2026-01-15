import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Create from './pages/Home/Create'
import Show from './pages/Show/Show'
import { ToastProvider } from './contexts/ToastContext'
import ToastList from './components/Toast/ToastList'

function App() {
  return (

    <BrowserRouter>
      <ToastProvider>
        <ToastList />
        <Routes>
          <Route path="/" element={<Create />}/>
          <Route path="/:id" element={<Show />}/>
        </Routes>
      </ToastProvider>
    </BrowserRouter>

  )
}

export default App
