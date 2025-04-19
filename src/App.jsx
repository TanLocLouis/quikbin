import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Create from "./create"
import Show from "./show"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Create />}/>
        <Route path="/:id" element={<Show />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
