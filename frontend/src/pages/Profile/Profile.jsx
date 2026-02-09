import "./Profile.css";
import { useEffect, useState } from "react";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import Card from "../../components/Card/Card";

const Profile = () => {
    const { addToast } = useToast();
    const { userInfo, accessToken } = useAuth();

    const [profileData, setProfileData] = useState({});
    const [binsData, setBinsData] = useState([]);

    const fetchUserProfile = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/${userInfo.username}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch user profile");
            }

            const data = await res.json();
            setProfileData(data.user);
        } catch (err) {
            console.error("Error fetching user profile:", err);
            addToast("error", "Failed to load user profile.");
        }
    }

    const fetchBinsData = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/bin/all`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
            })

            if (!res.ok) {
                throw new Error("Unable to fetch bin list");
            }

            const data = await res.json();
            setBinsData(data.data);
        } catch (err) {
            console.error("Error fetching data", err);
            addToast("error", "Failed to load bins data");
        }
    }

    useEffect(() => {
        fetchUserProfile();
        fetchBinsData();
    }, []);

    const convertToDateString = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString();
    }

    return (
        <div>
            <div className="profile-top-section">
                <div className="profile-top-section-banner">
                    <div className="profile-top-section-content">
                        <div className="profile-avatar">
                            {profileData.avatarUrl ? (
                                <img
                                    src={profileData.avatarUrl}
                                    alt="User Avatar"
                                />
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="100px" fill="var(--color-primary)" viewBox="0 0 640 640"><path d="M240 192C240 147.8 275.8 112 320 112C364.2 112 400 147.8 400 192C400 236.2 364.2 272 320 272C275.8 272 240 236.2 240 192zM448 192C448 121.3 390.7 64 320 64C249.3 64 192 121.3 192 192C192 262.7 249.3 320 320 320C390.7 320 448 262.7 448 192zM144 544C144 473.3 201.3 416 272 416L368 416C438.7 416 496 473.3 496 544L496 552C496 565.3 506.7 576 520 576C533.3 576 544 565.3 544 552L544 544C544 446.8 465.2 368 368 368L272 368C174.8 368 96 446.8 96 544L96 552C96 565.3 106.7 576 120 576C133.3 576 144 565.3 144 552L144 544z"/></svg>
                            )}
                        </div>

                        <div className="profile-info">
                            <h2 className="profile-username">{profileData.username || "Username"}</h2>
                            <p className="profile-email"> 📧 {profileData.email || "Email"}</p>
                            <p className="profile-createdAt">📆 {profileData.createdAt ? convertToDateString(profileData.createdAt) : "N/A"}</p>
                            <p className="profile-isVerified">{profileData.isVerified ? "✅ Verified" : "❌ Not Verified"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-container">
                <div className="profile-container-bins">
                    {binsData.length > 0 ? (
                        binsData.map((bin) => (
                            <Card key={bin._id} bin={bin} />
                        ))
                    ) : (
                        <p>No bins available.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Profile;