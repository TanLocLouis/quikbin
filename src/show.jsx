import { useParams } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";

function Show() {
  const { id } = useParams();
  const [text, setText] = useState("");
  const [metadata, setMetadata] = useState({
    id: "",
    expireAfter: 0,
    password: "",
    createdAt: new Date().toISOString(),
  });

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER + "get/" + id; 
    async function fetchData() {
      const response = await axios.get(url);
      console.log(response.data);
      setText(response.data.text);
      setMetadata(response.data.metadata);
    }

    fetchData();
  }, []);

  const handleCreateAnother = () => {
    location.href = import.meta.env.VITE_HOST;
  }

  const handleCopyLink = () => {
    const url = import.meta.env.VITE_HOST + metadata.id.slice(0, 8);
    navigator.clipboard.writeText(url).then(() => {
      document.getElementById("copy-link").innerText = "Copied!";
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

        <div style={{textAlign: "left", width: "1000px", margin: "0 auto", paddingTop: "1em"}}>
            <button id="copy-link" style={{margin: "0 0 0 1em"}} onClick={handleCopyLink}>Copy Link</button>
            <h5 style={{margin: "0 0 0 1em"}}>Created at: {metadata.createdAt}</h5>
            <h5 style={{margin: "0 0 0 1em"}}>Expire after: {metadata.expireAfter} hours</h5>
            <h5 style={{margin: "0 0 0 1em"}}>ID: {metadata.id}</h5>
            <textarea style={{margin: "1em", padding: "1em", width: "100%", height: "calc(100vh - 300px)"}} value={text}></textarea>
        </div>
    </div>
  );
}

export default Show;