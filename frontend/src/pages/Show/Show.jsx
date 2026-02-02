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
  const [isShortenedURL, setIsShortenedURL] = useState(false);

  const { addToast } = useToast();

  // Check if bin is locked 
  const checkPassword = async () => {
    const url = import.meta.env.VITE_SERVER + '/api/bin/is-locked/' + id;
    try {
      const response  = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw response;
      }      

      const data = await response.json();
      return data.isLocked;
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
    const url = import.meta.env.VITE_SERVER + '/api/bin/no-password/' + id;

    setIsLoading(true);
    try {
      const response =  await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw response;
      }

      const data = await response.json();
      setData(data);
      setIsShortenedURL(data.isShorternURL);
      setIsLoading(false);
    } catch (err) {
      addToast("error", "Failed to fetch bin data" + err.message);
      setIsLoading(false);
      return err;
    }
  }

  const fetchWithPassword = async (password) => {
    const url = import.meta.env.VITE_SERVER + '/api/bin/with-password/' + id;
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
      setIsShortenedURL(data.isShorternURL);
      setIsLoading(false);
      setShowLockedForm(false);
    } catch (err) {
      if (err.status === 401) {
        addToast("error", "Incorrect password");
        setIsLoading(false);
        return err;
      }
      addToast("error", "Failed to fetch bin data" + err.message);
      setIsLoading(false);
      return err;
    }
  }

  useEffect(() => {
    const loadBin = async () => {
      const isLocked = await checkPassword();

      if (!isLocked) {
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
      <div style={{height: "60px"}}></div>
      <div className="show-wrapper">
        <div className="show-wrapper-animate"></div>
        <div class="container">

          <div class="container-form">
            {showLockedForm &&
            <form class="show-form" onSubmit={handleSubmit}>
              <div id="locked-bin">
                <div style={{display: "flex", flexDirection: "column"}}>
                  <h5 style={{width: "300px", margin: "1em", color: "var(--color-text-secondary)", marginBottom: "0.5em", textAlign: "left"}}>This bin has been locked</h5>
                  <input style={{width: "300px", boxSizing: "border-box", marginBottom: 0}} onChange={handlePasswordChanged} placeholder="Type password here to unlock..." type="password"></input>
                  <Button width="300px"
                          height="50px"
                          margin="0.5em"
                          title="Unlock"
                          type="submit"
                          >
                  </Button>
                </div>
              </div>
            </form>}

            <div style={{textAlign: "left", width: "100%", margin: "0 auto"}}>
                {!showLockedForm &&
                  <div style={{margin: "0.5em 0 0 0"}}>
                    <div className="show-section-item">
                      <svg xmlns="http://www.w3.org/2000/svg" with="1em" height="1em" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M384 112L384 128C384 145.7 369.7 160 352 160L288 160C270.3 160 256 145.7 256 128L256 112L192 112C183.2 112 176 119.2 176 128L176 512C176 520.8 183.2 528 192 528L448 528C456.8 528 464 520.8 464 512L464 128C464 119.2 456.8 112 448 112L384 112zM128 128C128 92.7 156.7 64 192 64L448 64C483.3 64 512 92.7 512 128L512 512C512 547.3 483.3 576 448 576L192 576C156.7 576 128 547.3 128 512L128 128zM288 384L352 384C396.2 384 432 419.8 432 464C432 472.8 424.8 480 416 480L224 480C215.2 480 208 472.8 208 464C208 419.8 243.8 384 288 384zM264 288C264 257.1 289.1 232 320 232C350.9 232 376 257.1 376 288C376 318.9 350.9 344 320 344C289.1 344 264 318.9 264 288z"/></svg>
                      <h5>{data.bin_id}</h5>
                    </div>
                    <div className="show-section-item">
                      <svg xmlns="http://www.w3.org/2000/svg" with="1em" height="1em" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M466.6 114.2C461.2 115.9 455.3 116 450.4 113.3C444.6 110.1 438.6 107.1 432.6 104.4C422.2 99.7 418.9 86.1 428.5 79.8C443.5 69.9 461.5 64.1 480.8 64.1C533.4 64.1 576 106.7 576 159.3C576 172.5 573.3 185.1 568.4 196.6C563.9 207.1 550 206.4 543.5 197C539.7 191.5 535.7 186.2 531.5 181C528 176.6 527 170.8 527.7 165.2C527.9 163.3 528.1 161.3 528.1 159.3C528.1 133.2 506.9 112.1 480.9 112.1C476 112.1 471.2 112.9 466.7 114.3zM96.5 196.9C90 206.3 76 207 71.6 196.5C66.7 185 64 172.4 64 159.2C64 106.6 106.6 64 159.2 64C178.5 64 196.5 69.8 211.5 79.7C221.1 86 217.8 99.6 207.4 104.3C201.3 107.1 195.4 110 189.6 113.2C184.7 115.9 178.7 115.8 173.4 114.1C168.9 112.7 164.2 111.9 159.2 111.9C133.1 111.9 112 133.1 112 159.1C112 161.1 112.1 163.1 112.4 165C113.1 170.6 112.1 176.4 108.6 180.8C104.4 186 100.4 191.3 96.6 196.8zM496 352C496 254.8 417.2 176 320 176C222.8 176 144 254.8 144 352C144 449.2 222.8 528 320 528C417.2 528 496 449.2 496 352zM460.5 526.5C422.1 557.4 373.2 576 320 576C266.8 576 217.9 557.4 179.5 526.5L137 569C127.6 578.4 112.4 578.4 103.1 569C93.8 559.6 93.7 544.4 103.1 535.1L145.6 492.6C114.6 454.1 96 405.2 96 352C96 228.3 196.3 128 320 128C443.7 128 544 228.3 544 352C544 405.2 525.4 454.1 494.5 492.5L537 535C546.4 544.4 546.4 559.6 537 568.9C527.6 578.2 512.4 578.3 503.1 568.9L460.6 526.4zM344 248L344 342.1L385 383.1C394.4 392.5 394.4 407.7 385 417C375.6 426.3 360.4 426.4 351.1 417L303.1 369C298.6 364.5 296.1 358.4 296.1 352L296.1 248C296.1 234.7 306.8 224 320.1 224C333.4 224 344.1 234.7 344.1 248z"/></svg>
                      <h5>{convertUTCToLocal(data.createdAt)}</h5>
                    </div>
                    <div className="show-section-item">
                      <svg xmlns="http://www.w3.org/2000/svg" with="1em" height="1em" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M466.6 114.2C461.2 115.9 455.3 116 450.4 113.3C444.6 110.1 438.6 107.1 432.6 104.4C422.2 99.7 418.9 86.1 428.5 79.8C443.5 69.9 461.5 64.1 480.8 64.1C533.4 64.1 576 106.7 576 159.3C576 172.5 573.3 185.1 568.4 196.6C563.9 207.1 550 206.4 543.5 197C539.7 191.5 535.7 186.2 531.5 181C528 176.6 527 170.8 527.7 165.2C527.9 163.3 528.1 161.3 528.1 159.3C528.1 133.2 506.9 112.1 480.9 112.1C476 112.1 471.2 112.9 466.7 114.3zM96.5 196.9C90 206.3 76 207 71.6 196.5C66.7 185 64 172.4 64 159.2C64 106.6 106.6 64 159.2 64C178.5 64 196.5 69.8 211.5 79.7C221.1 86 217.8 99.6 207.4 104.3C201.3 107.1 195.4 110 189.6 113.2C184.7 115.9 178.7 115.8 173.4 114.1C168.9 112.7 164.2 111.9 159.2 111.9C133.1 111.9 112 133.1 112 159.1C112 161.1 112.1 163.1 112.4 165C113.1 170.6 112.1 176.4 108.6 180.8C104.4 186 100.4 191.3 96.6 196.8zM496 352C496 254.8 417.2 176 320 176C222.8 176 144 254.8 144 352C144 449.2 222.8 528 320 528C417.2 528 496 449.2 496 352zM460.5 526.5C422.1 557.4 373.2 576 320 576C266.8 576 217.9 557.4 179.5 526.5L137 569C127.6 578.4 112.4 578.4 103.1 569C93.8 559.6 93.7 544.4 103.1 535.1L145.6 492.6C114.6 454.1 96 405.2 96 352C96 228.3 196.3 128 320 128C443.7 128 544 228.3 544 352C544 405.2 525.4 454.1 494.5 492.5L537 535C546.4 544.4 546.4 559.6 537 568.9C527.6 578.2 512.4 578.3 503.1 568.9L460.6 526.4zM344 248L344 342.1L385 383.1C394.4 392.5 394.4 407.7 385 417C375.6 426.3 360.4 426.4 351.1 417L303.1 369C298.6 364.5 296.1 358.4 296.1 352L296.1 248C296.1 234.7 306.8 224 320.1 224C333.4 224 344.1 234.7 344.1 248z"/></svg>
                      <h5>{convertUTCToLocal(data.closeBinAt)} </h5>
                    </div>
                  </div>
                }

                {showLockedForm === false &&
                <div>
                  <div style={{display: "flex", gap: "0.5em", margin: "0.2em 0 1em 0"}}>
                    <Button width="100%"
                            height="50px"
                            margin="0.5em 0.2em 0 0"
                            title="Copy Link"
                            onClick={handleCopyLink}
                            type="button"
                            >
                    </Button>
                    <Button width="100%"
                            height="50px"
                            margin="0.5em 0 0 0.2em"
                            title="Copy Text"
                            onClick={handleCopyText}
                            type="button"
                            >
                    </Button>
                  </div>

                  <hr></hr>

                  <div>
                    <div>
                      <textarea class="show-textarea" value={data.text}></textarea>
                      {/* <AutoresizeTextArea 
                        value={data.text}
                      /> */}
                    </div>
                    
                    {isShortenedURL &&
                      <Button width="100%"
                              height="50px"
                              title="Open this Link"
                              onClick={handleOpenLinkClicked}
                              type="button"
                              >
                      </Button>
                    }
                  </div>
                </div>
                }

            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}

export default Show;