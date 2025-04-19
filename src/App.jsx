import { useEffect, useRef, useState } from 'react';
import './App.css'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function App() {
  useEffect(() => {
    document.getElementById("header-expire").value = 1;
  }, []);

  const [text, setText]= useState("");
  const handleTextChanged = (e) => {
    setText(e.target.value);
  }

  const [metadata, setMetadata] = useState({
    id: uuidv4().slice(0, 8),
    expireAfter: 0,
    password: "",
    createdAt: new Date().toISOString(),
  });
  const handleExpireChanged = (e) => {
    setMetadata({
      ...metadata,
      expireAfter: e.target.value,
    });
  }
  const handlePasswordChanged = (e) => {
    console.log(metadata);
    setMetadata({
      ...metadata,
      password: e.target.value,
    });
  }

  const textAreaRef = useRef(null);
  const handleClear = () => {
    setText("");
    textAreaRef.current.value = "";
    setMetadata({
      id: uuidv4(),
      expireAfter: 0,
      password: "",
      createdAt: new Date().toISOString(),
    });
  }

  
  const handleCreate = () => {
    const url = import.meta.env.VITE_HOST + 'create';
    console.log(url);
    axios.post(url, {
      text: text,
      metadata: metadata,
    })
  }

  const handleNew = () => {
    location.reload();
  }

  const curYear = new Date().getFullYear();
  return (
    <>
      <div className="header">
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
          <label style={{"margin": "0.5em", "marginBottom": "0em"}}>Expire after (hours): </label>
          <input  id="header-expire" 
                  type="number" 
                  onChange={handleExpireChanged}
                  placeholder='Hours'
                  required></input>
        </div>
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
        <label style={{"margin": "0.5em", "marginBottom": "0em"}}> Password: </label>
          <input type="password" 
                  onChange={handlePasswordChanged}
                  placeholder='Optional'></input>
        </div>
      </div>

      <div className="container">
        <textarea style={{"position": "absolute", "top": "100px", "left": "0px", "width": "100%", "height": "calc(100vh - 250px)"}}
                  onChange={handleTextChanged}
                  ref={textAreaRef}></textarea>
      </div>

      <div className="footer">
        <div className="footer-left">
          <div>
            <button onClick={handleNew}>New</button>
            <button onClick={handleCreate}>Create</button>
            <button style={{"display": "none"}}>Copy Link</button>
            <button onClick={handleClear}>Clear</button>
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
