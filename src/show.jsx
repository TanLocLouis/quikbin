import { useParams } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";

function Show() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");

  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          document.getElementById("locked-bin").style.display = 'block';
        }
      }
    }
  }

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER + "get/" + id; 
    fetchData(url);
  }, []);

  // Handle create new bin
  const handleCreateAnother = () => {
    location.href = import.meta.env.VITE_HOST;
  }

  // Handle locked password changed
  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  }
  // Handle submit
  const handleSubmit = (e) => {
    const url = import.meta.env.VITE_SERVER + 'get/' + id;

    axios.get(url, {params: {password}})
    .then((response) => {
      const data = response.data;
      setData(data);
    })
    .catch((err) => {
      if (err.response.status === 401) {
        alert("Wrong password");
      }
    })

    e.preventDefault();
  }

  // Copies
  const handleCopyLink = () => {
    const url = import.meta.env.VITE_HOST + data.id.slice(0, 8);
    navigator.clipboard.writeText(url).then(() => {
      document.getElementById("copy-link").innerText = "Copied!";
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }

  const handleCopyText = () => {
    navigator.clipboard.writeText(data.text).then(() => {
      document.getElementById("copy-text").innerText = "Copied!";
    }, (err) => {
      console.error('Could not copy text: ', err);
    });
  }

  const curYear = new Date().getFullYear();

  return (
    <div className="App">
        <div style={{marginBottom: "0px", padding: "1em", textAlign: "left"}}>
            <div style={{marginBottom: "1em"}}>
                <h2 style={{marginBottom: "0px"}}>QuikBin</h2>
                <h5 style={{marginTop: "0px", marginBottom: "0px"}}>Copyright 2020 - {curYear} @TanLocLouis</h5>
                <button style={{margin: "1em 0 0 0"}} onClick={handleCreateAnother}>Create another</button>
            </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div id="locked-bin" style={{display: "none"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
              <h5 style={{width: "300px", margin: "1em", textAlign: "left"}}>This bin has been locked</h5>
              <input style={{width: "300px", boxSizing: "border-box"}} onChange={handlePasswordChanged} placeholder="Type password"></input>
              <button style={{width: "300px"}}>Submit</button>
            </div>
          </div>
        </form>

        <div style={{textAlign: "left", width: "1000px", margin: "0 auto", paddingTop: "1em"}}>
            <h5 style={{margin: "0 0 0 1em"}}>Created at: {data.createdAt}</h5>
            <h5 style={{margin: "0 0 0 1em"}}>Expire at: {data.closeBinAt} </h5>
            <h5 style={{margin: "0 0 0 1em"}}>ID: {data.id}</h5>
            <button id="copy-link" style={{margin: "0 0 0 1em"}} onClick={handleCopyLink}>Copy Link</button>
            <button id="copy-text" style={{margin: "0 0 0 1em"}} onClick={handleCopyText}>Copy Text</button>
            <div>
              <textarea style={{margin: "1em", padding: "1em", width: "100vw", height: "calc(100vh - 300px)"}} value={data.text}></textarea>
            </div>
        </div>
    </div>
  );
}

export default Show;