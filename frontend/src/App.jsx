import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Create from './pages/Home/Create'
import Show from './pages/Show/Show'
import SignUp from './pages/SignUp/SignUp'
import Login from './pages/Login/Login'
import { ToastProvider } from './contexts/ToastContext'
import { AuthProvider } from './contexts/AuthContext'
import ToastList from '@/components/Toast/ToastList'
import TopHeader from '@/components/TopHeader/TopHeader'
import Footer from '@/components/Footer/Footer'
import VerifySignup from './pages/Verify/VerifySignUp'
import Profile from './pages/Profile/profile'

function App() {
  return (
    <div className="app">
      <BrowserRouter>

          <ToastProvider>
            <AuthProvider>
              <ToastList />

              <TopHeader />

              <Routes>
                <Route path="/sign-up" element={<SignUp />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/verify-sign-up" element={<VerifySignup />}/>
                <Route path="/profile" element={<Profile />}/>

                <Route path="/" element={<Create />}/>
                <Route path="/:id" element={<Show />}/>

              </Routes>

              <Footer />
            </AuthProvider>
          </ToastProvider>

      </BrowserRouter>
    </div>

  )
}

export default App
