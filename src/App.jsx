import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const curYear = new Date().getFullYear();
  return (
    <>
      <div className="header">
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
          <label style={{"margin": "0.5em", "marginBottom": "0em"}}>Expire after (hour): </label>
          <input type="number" placeholder=''></input>
        </div>
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
        <label style={{"margin": "0.5em", "marginBottom": "0em"}}> Password: </label>
          <input type="password" placeholder='Optional'></input>
        </div>
      </div>

      <div className="container">
        <textarea style={{"position": "absolute", "top": "100px", "left": "0px", "width": "100%", "height": "calc(100vh - 250px)"}}></textarea>
      </div>

      <div className="footer">
        <div className="footer-left">
          <div>
            <button>Save</button>
            <button>Load</button>
            <button>Clear</button>
            <button>Copy Link</button>
          </div>
          <div>
            <label>Copyright 2025 - {curYear} @TanLocLouis</label>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
