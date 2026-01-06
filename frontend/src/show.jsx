import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import "./show.css";
import Footer from "./components/Footer/Footer";
import TopHeader from "./components/TopHeader/TopHeader";
import { LoadingSpinner } from "./components/Spinner";

function Show() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirect = useNavigate();

  async function fetchData(url) {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      // console.log(response.data);
      if (response.data.message === "Redirect") {
        setData(response.data.bin);
        setIsLoading(false);
        // window.location.href = response.data.redirect;
        return;
      }

      setData(response.data);
      setIsLoading(false);
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

    setIsLoading(true);
    axios.get(url, {params: {password}})
    .then((response) => {
      const data = response.data;
      setData(data);
      setIsLoading(false);
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

  const convertUTCToLocal = (utcString) => {
    const utcDate = new Date(utcString);
    return utcDate.toLocaleString();
  }

  const curYear = new Date().getFullYear();

  if (isLoading) {
    return (
      <>
        {/* <h1>Loading...</h1> */}
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
          <LoadingSpinner />
        </div>
      </>
    )
  }

  return (
    <>
        <TopHeader />

        {/* <div class="show-header" style={{marginBottom: "0px", textAlign: "left"}}>
            <div class="show-header-icon">
              <button style={{}} onClick={handleCreateAnother}>Create another</button>
            </div>
        </div> */}

        <div class="container">
          <div class="container-form">
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
                <div style={{margin: "0.5em 0 0 0"}}>
                  <h5 style={{margin: "0"}}>ID: {data.id}</h5>
                  <h5 style={{margin: "0"}}>Created at: {convertUTCToLocal(data.createdAt)}</h5>
                  <h5 style={{margin: "0"}}>Expire at: {convertUTCToLocal(data.closeBinAt)} </h5>
                </div>

                <div style={{display: "flex", gap: "0.5em", margin: "0.5em 0 0.5em 0"}}>
                  <button id="copy-link" style={{margin: "0"}} onClick={handleCopyLink}>Copy Link</button>
                  <button id="copy-text" style={{margin: "0"}} onClick={handleCopyText}>Copy Text</button>
                </div>

                <hr></hr>

                <div style={{marginTop: "0.5em"}}>
                  <div>
                    <textarea class="show-textarea" value={data.text}></textarea>
                    {/* <AutoresizeTextArea 
                      value={data.text}
                    /> */}
                  </div>

                  <div>
                    <button type="button" style={{width: "100%", margin: 0, marginTop: "0.5em", backgroundColor: "var(--main-color)"}} onClick={handleOpenLinkClicked}>Open this Link</button>
                  </div>
                </div>
            </div>
          </div>
        </div>

        <Footer />
    </>
  );
}

export default Show;