import { useNavigate, useParams } from "react-router";
import axios from 'axios';
import { useEffect, useState } from "react";
import "./show.css";

function Show() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");

  const redirect = useNavigate();

  async function fetchData(url) {
    try {
      const response = await axios.get(url);
      // console.log(response.data);
      if (response.data.message === "Redirect") {
        setData(response.data.bin);
        // window.location.href = response.data.redirect;
        return;
      }

      setData(response.data);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          document.getElementById("locked-bin").style.display = 'block';
        } else if (err.response.status === 404) {
          alert("Bin not found");
          // location.href = import.meta.env.VITE_HOST;
          redirect("/");
        }
      }
    }
  }

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER + "/get/" + id; 
    fetchData(url);
  }, []);

  // Handle create new bin
  const handleCreateAnother = () => {
    // location.href = import.meta.env.VITE_HOST;
    redirect("/");
  }

  // Handle locked password changed
  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  }
  // Handle submit
  const handleSubmit = (e) => {
    const url = import.meta.env.VITE_SERVER + '/get/' + id;

    axios.get(url, {params: {password}})
    .then((response) => {
      const data = response.data;
      setData(data);
      document.getElementById("locked-bin").style.display = 'none';
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
    const url = import.meta.env.VITE_HOST + '/' + data.id;
    navigator.clipboard.writeText(url).then(() => {
      console.log("OKKKKKK");
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

  const handleOpenLinkClicked = () => {
    window.open(data.text, '_blank');
  }

  const curYear = new Date().getFullYear();

  return (
    <>
        <div class="show-header" style={{marginBottom: "0px", padding: "1em", textAlign: "left"}}>
            <div style={{marginBottom: "1em"}}>
                <h2 style={{margiddnBottom: "0px"}}>QuikBin</h2>
                <button style={{margin: "0.5em 0 0 0"}} onClick={handleCreateAnother}>Create another</button>
            </div>
        </div>

        <form class="show-form" onSubmit={handleSubmit}>
          <div id="locked-bin" style={{display: "none"}}>
            <div style={{display: "flex", flexDirection: "column"}}>
              <h5 style={{width: "300px", margin: "1em", color: "red", marginBottom: "0.5em", textAlign: "left"}}>Type password to unlock this bin</h5>
              <input style={{width: "300px", boxSizing: "border-box", marginBottom: 0}} onChange={handlePasswordChanged} placeholder="Type password"></input>
              <button style={{width: "300px"}}>Unlock</button>
            </div>
          </div>
        </form>

        <div style={{textAlign: "left", width: "100%", margin: "0 auto"}}>
            <div style={{margin: "0.5em 0 0 0.5em"}}>
              <h5 style={{margin: "0"}}>Created at: {data.createdAt}</h5>
              <h5 style={{margin: "0"}}>Expire at: {data.closeBinAt} </h5>
              <h5 style={{margin: "0"}}>ID: {data.id}</h5>
            </div>

            <div style={{display: "flex", gap: "0.5em", margin: "0.5em 0 0 0.5em"}}>
              <button id="copy-link" style={{margin: "0"}} onClick={handleCopyLink}>Copy Link</button>
              <button id="copy-text" style={{margin: "0"}} onClick={handleCopyText}>Copy Text</button>
            </div>

            <div>
              <button style={{width: "100%", backgroundColor: "var(--main-color)"}} onClick={handleOpenLinkClicked}>Open this Link</button>
            </div>

            <div>
              <textarea class="show-textarea" value={data.text}></textarea>
            </div>
        </div>

        <div style={{"display": "flex", "justifyContent": "center", "alignItems": "center", "height": "75px", "backgroundColor": "var(--footer-color)"}}>
          <label>Copyright 2025 - {curYear} @TanLocLouis</label>
        </div>
    </>
  );
}

export default Show;