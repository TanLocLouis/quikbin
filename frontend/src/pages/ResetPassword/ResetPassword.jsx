import "./ResetPassword.css";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";

const ResetPassword = () => {
    const [ResetForm, setResetForm] = useState({
        email: "",
    })

    const handleResetFormChanged = (e) => {
        setResetForm({
            ...ResetForm,
            [e.target.name]: e.target.value
        });
    }
    const [isResetting, setIsResetting] = useState(false);

    const redirect = useNavigate();
    const { addToast } = useToast();
    const handleResetPasswordFormSubmitted = async (e) => {
        e.preventDefault();
        setIsResetting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: ResetForm.email
                })
            });

            addToast("info", "Password reset email sent. Please check your inbox.");
            if (!response.ok) {
                throw new Error("Failed to reset password");
            }

            redirect("/reset-password-form");
        } catch (err) {
            console.error("Failed to reset password", err);
            addToast("error", "Failed to reset password. Please try again later.");
            setIsResetting(false);
            return;
        }
    }

    return (
        <>
            <div className="login-wrapper">
                <div className="login-wrapper-animate"></div>
                <div className="login-container">
                    <form className="login-container-form" onSubmit={handleResetPasswordFormSubmitted}>
                        <h2 className="login-form-header">Reset Password</h2>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" 
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                required 
                                onChange={handleResetFormChanged}/>
                        </div>

                        <button type="submit" className="login-submit-button" disabled={isResetting}>
                            {isResetting ? "Resetting..." : "Reset Password"}
                        </button>

                        <div className="forgot-password-link">
                            <label>Reset Done? Login <a href="/login">here</a></label>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;