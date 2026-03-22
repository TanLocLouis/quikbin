import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { v4 as uuidv4, validate } from 'uuid';
import axios from 'axios';
import './Create.css';

import Switch from '@/components/Switch/Switch';
import AutoResizeTextarea from '@/components/AutoResizeTextArea/AutoResizeTextArea';
import Button from '../../components/Button/Button';

import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { fetchWithAuth } from '../../utils/fetchWithAuth';

function Create() {
  const expireList = {
    '1 minute': 60,
    '15 minutes': 900,
    '30 minutes': 1800,
    '1 hour': 3600,
    '6 hours': 21600,
    '12 hours': 43200,
    '24 hours': 86400,
    // Not acctually never, but 100 years :)
    'Never': 3600 * 24 * 365 * 100,
  };

  const { addToast } = useToast();
  const { userInfo, accessToken } = useAuth();
  
  const [data, setData]= useState({
    id: uuidv4().slice(0, 8),
    text: "",
    password: "",
    expireTime: expireList['15 minutes'],
    isShorternURL: false,
  });
  const [checkShorternURL, setCheckShorternURL] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textAreaRef = useRef(null);
  const handleClear = () => {
    setData({
      ...data,
      text: "",
    });
    textAreaRef.current.value = "";
    textAreaRef.current.focus();
  }

  useEffect(() => {
    document.getElementById("header-id").value = data.id;
  }, []);

  // ID state
  const validateId = (id) => {
    if (!id) {
      addToast("warning", "ID cannot be empty");
      return false;
    }

    if (id.length > 20) {
      addToast("warning", "ID cannot be longer than 20 characters");
      return false;
    }

    if (/[^a-zA-Z0-9-_]/.test(id)) {
      addToast("warning", "ID can only contain letters, numbers, hyphens, and underscores");
      return false;
    }

    return true;
  }

  const handleIDChanged = (e) => {
    const id = e.target.value;

    setData({
      ...data,
      id: id,
    })

    if (!validateId(id)) return;
  }

  // Text area state
  const validateText = (text) => {
    if (!text) {
      addToast("warning", "Text cannot be empty");
      return false;
    }

    if (text.length > 100000) {
      addToast("warning", "Text cannot be longer than 100000 characters");
      return false;
    }

    return true;
  }

  const handleTextChanged = (e) => {
    const text = e.target.value;

    setData({
      ...data,
      text: text,
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
  const validatePassword = (password) => {
    if (password.length > 0 && password.length < 8) {
      addToast("warning", "Password must be at least 8 characters");
      return false;
    }

    if (password.length > 50) {
      addToast("warning", "Password cannot be longer than 50 characters");
      return false;
    }

    if (/[^a-zA-Z0-9-_]/.test(password)) {
      addToast("warning", "Password can only contain letters, numbers, hyphens, and underscores");
      return false;
    }

    return true;
  }

  const handlePasswordChanged = (e) => {
    const password = e.target.value;
    setData({
      ...data,
      password: e.target.value,
    })

    if (!validatePassword(password)) return;
  }

  // Shortern URL state
  const handleShorternURLChanged = (checked) => {
    setCheckShorternURL(checked);
    setData({
      ...data,
      isShorternURL: checked,
    })
  }

  // Handle create data
  const navigate = useNavigate();
  const handleCreate = async () => {
    const isValidInput = validateId(data.id)
    && validateText(data.text)
    && validatePassword(data.password);

    if (!isValidInput) {
      addToast("error", "Please fix the errors before creating the bin");
      return;
    }

    setIsSubmitting(true);

    if (accessToken) {
      const url = import.meta.env.VITE_API_URL + '/api/bins/create/authenticated';
      try {
        const res = await fetchWithAuth(useAuth, url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({data}),
        });

        if (!res.ok && res.status !== 401) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const responseData = await res.json();
        navigate('/' + data.id.slice(0, 8));
        setIsSubmitting(false);
      } catch (err) {
        setIsSubmitting(false);
        addToast("error", "An error occurred while creating the bin");
        return;
      }
    } 
    else {
      const url = import.meta.env.VITE_API_URL + '/api/bins/create';
      console.log(url, data);
      axios.post(url, {data})
      .then((response) => {
        navigate('/' + data.id.slice(0, 8));
        setIsSubmitting(false);
      })
      .catch((error) => {
        setIsSubmitting(false);
        if (error.status == 400) {
          addToast("warning", error.response.data.message);
          return;
        }
      });
    }
  }

  // Create new bin
  const handleNew = () => {
    location.reload();
  }

  return (
    <>
      <div className="create-wrapper">
        {/* <div className="create-wrapper-animate"></div> */}
        <div className="header">
          <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
            <label style={{"margin": "0.5em", "marginBottom": "0em"}}>ID </label>
            <input  id="header-id" 
                    type="text" 
                    onChange={handleIDChanged}
                    placeholder='ID'
                    required></input>
          </div>

          <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
            <label style={{"margin": "0.5em", "marginBottom": "0em"}}> Password </label>
            <input type="password" 
                    onChange={handlePasswordChanged}
                    placeholder='Optional'></input>
          </div>

          <div style={{"display": "flex", "flexDirection": "column", "alignItems": "start"}}>
            <label style={{"margin": "0.5em", "marginBottom": "0em"}}>Expire after </label>
            <select id="header-expire" onChange={handleExpireChanged}>
              {expireList && Object.keys(expireList).map((key) => (
                <option key={key} value={expireList[key]} selected={expireList[key] === expireList['15 minutes']}>{key}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="container">
          <div className="container-form">
            <div>
              <div style={{"display": "flex", "justifyContent": "flex-start", "alignItems": "center"}} >
                <Switch checked={checkShorternURL} onChange={handleShorternURLChanged}/>
                <label style={{"color": "var(--color-text-secondary)"}}>Make this as ShortenURL</label>
              </div>
              
              <div style={{"margin": "0.5em 0 0.5em 0"}}>
                <AutoResizeTextarea
                  minHeight="0px" 
                  value={data.text}
                  onChange={handleTextChanged}
                  placeholder="Your text here..."
                />
              </div>
            </div>

            {/* <div style={{"width": "100%", "marginTop": "0.5em"}}>
                <button style={{"width": "100%", "margin": "0", "backgroundColor": "var(--main-color)", "color": "white"}}
                        onClick={handleCreate}>Create</button>
            </div> */}
            <Button width="100%"
                    height="50px"
                    margin="0"
                    title={isSubmitting ? "Creating..." : "Create"}
                    disabled={isSubmitting}
                    onClick={handleCreate}
                    >
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Create;