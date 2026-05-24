import { useState } from "react";
import { useNavigate } from "react-router";
import "./Card.css";
import { useToast } from "../../contexts/ToastContext";
import Switch from '@/components/Switch/Switch';

const Card = ( { bin, isBookMarked, onBookmark, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        _id,
        bin_id,
        text,
        expireTime,
        createdAt,
        closeBinAt
    } = bin;

    const [hasPassword, setHasPassword] = useState(!!bin.password);
    const [isShorternURL, setIsShorternURL] = useState(!!bin.isShorternURL);

    const { addToast } = useToast();

    const handleExpandClicked = () => {
        setExpanded((prev) => !prev);
    }

    const redirect = useNavigate();
    const handleBinClicked = (e, binId) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) {
            return;
        }

        e.preventDefault();
        redirect(`/${binId}`);
    }

    const handleEditClicked = () => {
        setIsEditPasswordOpen((prev) => !prev);
    }

    const handleNewPasswordChanged = (e) => {
        setNewPassword(e.target.value);
    }

    const handleUpdateNewPassword = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const url = import.meta.env.VITE_API_URL + '/api/bins/' + bin_id;
        try {
            const response  = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password: newPassword })
            });

            if (!response.ok) {
                throw response;
            }      

            addToast("info", "Password updated successfully");
            setIsEditPasswordOpen(false);
            setHasPassword(true);
            setNewPassword("");
            const data = await response.json();
        } catch (err) {
            if (err.status === 404) {
                addToast("error", "Bin not found");
            }
            addToast("error", "Failed to check bin status");
            return err;
        } finally {
            setIsUpdating(false);
        }
    }

    const handleUpdateCheckPassword = async (checked) => {
        // Turning ON: open the edit modal so user can set a password
        if (checked) {
            setIsEditPasswordOpen(true);
            return;
        }

        // Turning OFF: clear password on the server
        setIsUpdating(true);
        const url = import.meta.env.VITE_API_URL + '/api/bins/' + bin_id + '/password';
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: false })
            });

            if (!response.ok) {
                throw response;
            }

            setHasPassword(false);
            addToast("info", "Password protection disabled");
        } catch (err) {
            if (err.status === 404) {
                addToast("error", "Bin not found");
            } else {
                addToast("error", "Failed to update password");
            }
        } finally {
            setIsUpdating(false);
        }
    }

    const handleUpdateCheckShortenURL = async (checked) => {
        setIsUpdating(true);
        const url = import.meta.env.VITE_API_URL + '/api/bins/' + bin_id + '/shorten-url';
        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled: checked })
            });

            if (!response.ok) {
                throw response;
            }

            setIsShorternURL(checked);
            addToast("info", `Shorten URL ${checked ? "enabled" : "disabled"}`);
        } catch (err) {
            if (err.status === 404) {
                addToast("error", "Bin not found");
            } else {
                addToast("error", "Failed to update shorten URL");
            }
        } finally {
            setIsUpdating(false);
        }
    }


    return (
        <div className="card">
            <div className="card-header">
                <div className={`card-header-expand${expanded ? " expanded" : ""}`}>
                    <svg onClick={handleExpandClicked}  xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" fill="var(--color-primary)" viewBox="0 0 448 512"><path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/></svg> 
                </div>

                <div className="card-header-content">
                    <a onClick={(e) => handleBinClicked(e, bin_id)} className={`card-text${expanded ? " expanded" : ""}`} href={`${import.meta.env.VITE_HOST}/${bin_id}`} target="_blank" rel="noopener noreferrer">
                        <p className="card-text">
                            {text}
                        </p>
                    </a>
                    {expanded && (
                        <div className="card-details">
                            <p><strong>Bin ID:</strong> {bin_id}</p>
                            <div className="card-details-password">
                                <p><strong>Password Protected:</strong> {hasPassword ? "Yes" : "No"}</p>
                                <Switch checked={hasPassword} onChange={handleUpdateCheckPassword} disabled={isUpdating}/>
                                {hasPassword && (
                                    <svg onClick={handleEditClicked} xmlns="http://www.w3.org/2000/svg" width="2em" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M505 122.9L517.1 135C526.5 144.4 526.5 159.6 517.1 168.9L488 198.1L441.9 152L471 122.9C480.4 113.5 495.6 113.5 504.9 122.9zM273.8 320.2L408 185.9L454.1 232L319.8 366.2C316.9 369.1 313.3 371.2 309.4 372.3L250.9 389L267.6 330.5C268.7 326.6 270.8 323 273.7 320.1zM437.1 89L239.8 286.2C231.1 294.9 224.8 305.6 221.5 317.3L192.9 417.3C190.5 425.7 192.8 434.7 199 440.9C205.2 447.1 214.2 449.4 222.6 447L322.6 418.4C334.4 415 345.1 408.7 353.7 400.1L551 202.9C579.1 174.8 579.1 129.2 551 101.1L538.9 89C510.8 60.9 465.2 60.9 437.1 89zM152 128C103.4 128 64 167.4 64 216L64 488C64 536.6 103.4 576 152 576L424 576C472.6 576 512 536.6 512 488L512 376C512 362.7 501.3 352 488 352C474.7 352 464 362.7 464 376L464 488C464 510.1 446.1 528 424 528L152 528C129.9 528 112 510.1 112 488L112 216C112 193.9 129.9 176 152 176L264 176C277.3 176 288 165.3 288 152C288 138.7 277.3 128 264 128L152 128z"/></svg>
                                )}
                            </div>
                            {isEditPasswordOpen && (
                                <div>
                                    <form className="card-details-password-update" onSubmit={handleUpdateNewPassword}>
                                        <input onChange={handleNewPasswordChanged} name="newPassword" placeholder="Type your new password..." />
                                        <button type="submit" disabled={isUpdating}>
                                            {isUpdating ? "Updating..." : "Update"}
                                        </button>
                                        <button type="button" onClick={handleEditClicked}>Cancel</button>
                                    </form>
                                </div>
                            )}
                            {/* <p><strong>Expires In:</strong> {expireTime ? `${expireTime} seconds` : "Never"}</p> */}
                            <div className="card-details-password">
                                <p><strong>Shortened URL:</strong> {isShorternURL ? "Yes" : "No"}</p>
                                <Switch checked={isShorternURL} onChange={handleUpdateCheckShortenURL} disabled={isUpdating}/>
                            </div>
                            <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
                            <p><strong>Closed At:</strong> {new Date(closeBinAt).toLocaleString()}</p>
                        </div>
                    )}
                </div>

                <div className="card-header-expand">
                    {isBookMarked ? (
                        <svg onClick={onBookmark} xmlns="http://www.w3.org/2000/svg" width="1.2em" fill="var(--color-success)" viewBox="0 0 384 512"><path d="M64 0C28.7 0 0 28.7 0 64L0 480c0 11.5 6.2 22.2 16.2 27.8s22.3 5.5 32.2-.4L192 421.3 335.5 507.4c9.9 5.9 22.2 6.1 32.2 .4S384 491.5 384 480l0-416c0-35.3-28.7-64-64-64L64 0z"/></svg>
                    ) : (
                        <svg onClick={onBookmark} xmlns="http://www.w3.org/2000/svg" width="1.2em" fill="var(--color-primary)" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L320 0c35.3 0 64 28.7 64 64l0 417.1c0 25.6-28.5 40.8-49.8 26.6L192 412.8 49.8 507.7C28.5 521.9 0 506.6 0 481.1L0 64zM64 48c-8.8 0-16 7.2-16 16l0 387.2 117.4-78.2c16.1-10.7 37.1-10.7 53.2 0L336 451.2 336 64c0-8.8-7.2-16-16-16L64 48z"/></svg>
                    )}
                    <svg onClick={() => onDelete(bin_id, text)} xmlns="http://www.w3.org/2000/svg" width="1.5em" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M262.2 48C248.9 48 236.9 56.3 232.2 68.8L216 112L120 112C106.7 112 96 122.7 96 136C96 149.3 106.7 160 120 160L520 160C533.3 160 544 149.3 544 136C544 122.7 533.3 112 520 112L424 112L407.8 68.8C403.1 56.3 391.2 48 377.8 48L262.2 48zM128 208L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 208L464 208L464 512C464 520.8 456.8 528 448 528L192 528C183.2 528 176 520.8 176 512L176 208L128 208zM288 280C288 266.7 277.3 256 264 256C250.7 256 240 266.7 240 280L240 456C240 469.3 250.7 480 264 480C277.3 480 288 469.3 288 456L288 280zM400 280C400 266.7 389.3 256 376 256C362.7 256 352 266.7 352 280L352 456C352 469.3 362.7 480 376 480C389.3 480 400 469.3 400 456L400 280z"/></svg>
                </div>
            </div>
        </div> 
    )
}

export default Card;