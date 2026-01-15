import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import axios from 'axios';
import "./Show.css";

import Footer from "@/components/Footer/Footer";
import TopHeader from "@/components/TopHeader/TopHeader";
import LoadingSpinner from "@/components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import { useToast } from "../../contexts/ToastContext";

function Show() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { addToast } = useToast();

  const redirect = useNavigate();

  async function fetchData(url) {
    setIsLoading(true);
    try {
      const response = await axios.get(url);
      if (response.data.message === "Redirect") {
        setData(response.data.bin);
        setIsLoading(false);
        return;
      }

      setData(response.data);
      setIsLoading(false);
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          document.getElementById("locked-bin").style.display = 'block';
        } else if (err.response.status === 404) {
          addToast("error", "Bin not found");
          redirect("/");
        }
      }
    }
  }

  useEffect(() => {
    const url = import.meta.env.VITE_SERVER + "/" + id; 
    fetchData(url);
  }, []);

  // Handle create new bin
  const handleCreateAnother = () => {
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
        addToast("error", "Wrong password");
        setIsLoading(false);
      }
    })

    e.preventDefault();
  }

  // Copies
  const handleCopyLink = () => {
    addToast("info", "Link copied to clipboard");
    const url = import.meta.env.VITE_HOST + '/' + data.id;
    navigator.clipboard.writeText(url).then(() => {
    }, (err) => {
    });
  }

  const handleCopyText = () => {
    addToast("info", "Text copied to clipboard");
    navigator.clipboard.writeText(data.text).then(() => {
    }, (err) => {
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
                  <h5 style={{margin: "0 0 0.3em 0"}}>ID: {data.id}</h5>
                  <h5 style={{margin: "0 0 0.3em 0"}}>Created at: {convertUTCToLocal(data.createdAt)}</h5>
                  <h5 style={{margin: "0"}}>Expire at: {convertUTCToLocal(data.closeBinAt)} </h5>
                </div>

                <div style={{display: "flex", gap: "0.5em", margin: "0.2em 0 1em 0"}}>
                  <Button width="100%"
                          height="50px"
                          margin="0.5em 0.2em 0 0"
                          title="Copy Link"
                          color="white"
                          backgroundColor="var(--main-color)"
                          onClick={handleCopyLink}
                          >
                  </Button>
                  <Button width="100%"
                          height="50px"
                          margin="0.5em 0 0 0.2em"
                          title="Copy Text"
                          color="white"
                          backgroundColor="var(--main-color)"
                          onClick={handleCopyText}
                          >
                  </Button>
                </div>

                <hr></hr>

                <div style={{marginTop: "0.5em"}}>
                  <div>
                    <textarea class="show-textarea" value={data.text}></textarea>
                    {/* <AutoresizeTextArea 
                      value={data.text}
                    /> */}
                  </div>

                  <Button width="100%"
                          height="50px"
                          margin="0.5em 0 0 0"
                          title="Open this Link"
                          color="white"
                          backgroundColor="var(--main-color)"
                          onClick={handleOpenLinkClicked}
                          >
                  </Button>
                </div>
            </div>
          </div>
        </div>

        <Footer />
    </>
  );
}

export default Show;