import { useState } from "react";
import { useNavigate } from "react-router";
import "./Card.css";

const Card = ( { bin }) => {
    const [expanded, setExpanded] = useState(false);

    const {
        _id,
        bin_id,
        text,
        password,
        expireTime,
        isShorternURL,
        createdAt,
    } = bin;

    const handleExpandClicked = () => {
        setExpanded((prev) => !prev);
    }

    const redirect = useNavigate();
    const handleBinClicked = (binId) => {
        redirect(`/${binId}`);
    }

    return (
        <div className="card">
            <div className="card-header">
                <div className={`card-header-expand${expanded ? " expanded" : ""}`}>
                    <svg onClick={handleExpandClicked}  xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="var(--color-primary)" viewBox="0 0 448 512"><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg> 
                </div>
                <div className="card-header-content">
                    <p onClick={() => handleBinClicked(bin_id)} className={`card-text${expanded ? " expanded" : ""}`}>{text}</p>
                    {expanded && (
                        <div className="card-details">
                            <p><strong>Bin ID:</strong> {bin_id}</p>
                            <p><strong>Password Protected:</strong> {password ? "Yes" : "No"}</p>
                            <p><strong>Expires In:</strong> {expireTime ? `${expireTime} seconds` : "Never"}</p>
                            <p><strong>Shortened URL:</strong> {isShorternURL ? "Yes" : "No"}</p>
                            <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div> 
    )
}

export default Card;