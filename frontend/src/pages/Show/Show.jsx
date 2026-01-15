import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "./Show.css";

import LoadingSpinner from "@/components/Spinner/Spinner";
import Button from "../../components/Button/Button";
import { useToast } from "../../contexts/ToastContext";

function Show() {
  const { id } = useParams();
  const [data, setData] = useState({});
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLockedForm, setShowLockedForm] = useState(false);

  const { addToast } = useToast();

  // Check if bin is locked 
  const checkPassword = async () => {
    const url = import.meta.env.VITE_SERVER + '/is-locked/' + id;
    try {
      const response  = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      return data.message;
    } catch (err) {
      if (err.status === 404) {
        addToast("error", "Bin not found");
      }
      addToast("error", "Failed to check bin status");
      return err;
    }
  }

  // Fetching data
  const fetchWithoutPassword = async () => {
    const url = import.meta.env.VITE_SERVER + '/' + id + '/no-password';

    setIsLoading(true);
    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setData(data);
      setIsLoading(false);
    } catch (err) {
      addToast("error", "Failed to fetch bin data" + err.message);
      setIsLoading(false);
      return err;
    }
  }

  const fetchWithPassword = async (password) => {
    const url = import.meta.env.VITE_SERVER + '/' + id + '/lock';
    setIsLoading(true);
    try {
      const response =  await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: password })
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setData(data);
      setIsLoading(false);
      setShowLockedForm(false);
    } catch (err) {
      if (err.status === 401) {
        addToast("error", "Incorrect password");
      }
      addToast("error", "Failed to fetch bin data" + err.message);
      setIsLoading(false);
      return err;
    }
  }

  useEffect(() => {
    const loadBin = async () => {
      const status = await checkPassword();

      if (status === "no-password") {
        await fetchWithoutPassword();
      } else {
        setShowLockedForm(true);
      }
    }

    loadBin();
  }, []);

  // Handle locked password changed
  const handlePasswordChanged = (e) => {
    setPassword(e.target.value);
  }

  // Handle submit for fetching with password
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetchWithPassword(password);
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
 
  // Utils
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
      <div className="show-wrapper">
        <div class="container">
          <div class="container-form">
            {showLockedForm &&
            <form class="show-form" onSubmit={handleSubmit}>
              <div id="locked-bin">
                <div style={{display: "flex", flexDirection: "column"}}>
                  <h5 style={{width: "300px", margin: "1em", color: "red", marginBottom: "0.5em", textAlign: "left"}}>This bin has been locked</h5>
                  <input style={{width: "300px", boxSizing: "border-box", marginBottom: 0}} onChange={handlePasswordChanged} placeholder="Type password here to unlock..."></input>
                  <Button width="300px"
                          height="50px"
                          margin="0.5em"
                          title="Unlock"
                          color="white"
                          backgroundColor="var(--main-color)"
                          type="submit"
                          >
                  </Button>
                </div>
              </div>
            </form>}

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
                          type="button"
                          >
                  </Button>
                  <Button width="100%"
                          height="50px"
                          margin="0.5em 0 0 0.2em"
                          title="Copy Text"
                          color="white"
                          backgroundColor="var(--main-color)"
                          onClick={handleCopyText}
                          type="button"
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
                          type="button"
                          >
                  </Button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Show;