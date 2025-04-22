import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

function Create() {
  // Text area state
  const [text, setText]= useState("");
  const handleTextChanged = (e) => {
    setText(e.target.value);
  }

  // Metadata state
  const [metadata, setMetadata] = useState({
    id: uuidv4().slice(0, 8),
    expireAfter: 1,
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
    setMetadata({
      ...metadata,
      password: e.target.value,
    });
  }

  // ID state
  const textAreaRef = useRef(null);
  const handleClear = () => {
    setText("");
    textAreaRef.current.value = "";
    setMetadata({
      id: uuidv4(),
      expireAfter: 1,
      password: "",
      createdAt: new Date().toISOString(),
    });
  }
  const handleIDChanged = (e) => {
    setMetadata({
      ...metadata,
      id: e.target.value,
    });
  }

  useEffect(() => {
    document.getElementById("header-id").value = metadata.id;
  }, []);

  // Handle create data
  const handleCreate = () => {
    const url = import.meta.env.VITE_SERVER + 'create';
    axios.post(url, {
      text: text,
      metadata: metadata,
    }).then((response) => {
      location.href = import.meta.env.VITE_HOST + metadata.id.slice(0, 8);
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
          <label style={{"margin": "0.5em", "marginBottom": "0em"}}>ID: </label>
          <input  id="header-id" 
                  type="text" 
                  onChange={handleIDChanged}
                  placeholder='ID'
                  required></input>
        </div>
        <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
          <label style={{"margin": "0.5em", "marginBottom": "0em"}}>Expire after: </label>
          <select id="header-expire" onChange={handleExpireChanged}>
            <option value="60">1 minutes</option>
            <option value="900" selected>15 minutes</option>
            <option value="1800">30 minutes</option>
            <option value="3600">1 hours</option>
            <option value="21600">6 hours</option>
            <option value="43200">12 hours</option>
            <option value="86400">24 hours</option>
            <option value="Never">Never</option>
          </select>
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

export default Create;