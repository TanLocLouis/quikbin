import { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import './create.css';

function Create() {
  const expireList = {
    '1 minute': 60,
    '15 minutes': 900,
    '30 minutes': 1800,
    '1 hour': 3600,
    '6 hours': 21600,
    '12 hours': 43200,
    '24 hours': 86400,
    'Never': 0,
  };

  const [data, setData]= useState({
    text: "",
    id: uuidv4().slice(0, 8),
    password: "",
    expireTime: expireList['15 minutes'],
    createdAt: "",
    closeBinAt: "",
  });

  // Text area state
  const handleTextChanged = (e) => {
    setData({
      ...data,
      text: e.target.value,
    })
  }

  // ID state
  const textAreaRef = useRef(null);
  const handleClear = () => {
    setData({
      ...data,
      text: "",
    });
    textAreaRef.current.value = "";
    textAreaRef.current.focus();
  }
  const handleIDChanged = (e) => {
    setData({
      ...data,
      id: e.target.value,
    })
  }

  // Expire state
  const handleExpireChanged = (e) => {
    const expire = e.target.value;
    setData({
      ...data,
      expireTime: expire,
    })
  }

  // Password state
  const handlePasswordChanged = (e) => {
    setData({
      ...data,
      password: e.target.value,
    })
  }

  useEffect(() => {
    document.getElementById("header-id").value = data.id;
  }, []);

  // Handle create data
  const handleCreate = () => {
    const url = import.meta.env.VITE_SERVER + '/create';
    axios.post(url, {data})
    .then((response) => {
      location.href = import.meta.env.VITE_HOST + '/' + data.id.slice(0, 8);
    })
    .catch((error) => {
      console.log(error);

      if (error.status == 400) {
        alert('ID already exists. Please choose another ID.');
        return;
      }
    });
  }

  // Create new bin
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
            <option value={expireList['1 minute']}>1 minutes</option>
            <option value={expireList['15 minutes']} selected>15 minutes</option>
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
        <div style={{"display": "flex", "justifyContent": "flex-start", "backgroundColor": "black"}}>
          <button onClick={handleNew}>New</button>
          <button style={{"display": "none"}}>Copy Link</button>
          <button onClick={handleClear}>Clear</button>
        </div>
        <textarea style={{"width": "100vw", "height": "calc(100vh - 250px)", "boxSizing": "border-box", "padding": "1em", "fontSize": "1.5em", "resize": "none"}}
                  onChange={handleTextChanged}
                  ref={textAreaRef}></textarea>
      </div>

      <div className="footer">
        <div style={{"width": "100%", "padding": "0.5em"}}>
          <button style={{"width": "100%", "margin": "0", "backgroundColor": "var(--main-color)"}}
                  onClick={handleCreate}>Create</button>
        </div>
        <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center"}}>
          <label>Copyright 2025 - {curYear} @TanLocLouis</label>
        </div>
      </div>
    </>
  )
}

export default Create;