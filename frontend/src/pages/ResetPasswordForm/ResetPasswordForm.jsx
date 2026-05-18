import "./ResetPasswordForm.css";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useToast } from "../../contexts/ToastContext";

const ResetPasswordForm = () => {
    const [tokenParams] = useSearchParams();
    const resetToken = tokenParams.get("token");

    const [ResetForm, setResetForm] = useState({
        password: "",
        confirmPassword: ""
    })
    const [isRessettingPassword, setIsResettingPassword] = useState(false);

    const handleResetPasswordFormChanged = (e) => {
        setResetForm({
            ...ResetForm,
            [e.target.name]: e.target.value
        });
    }

    const { addToast } = useToast();
    const handleLoginFormSubmitted = async (e) => {
        e.preventDefault();


        // Validate password
        if (ResetForm.password !== ResetForm.confirmPassword) {
            addToast("error", "Passwords do not match. Please try again.");
            return;
        }

        setIsResettingPassword(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-reset-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    resetToken: resetToken,
                    newPassword: ResetForm.password
                })
            });

            if (!response.ok) {
                throw new Error("Failed to reset password");
            }

            addToast("info", "Password reset successfully. Please log in with your new password.");
        } catch (err) {
            console.error("Failed to reset password", err);
            addToast("error", "Failed to reset password. Please try again later.");
            return;
        } finally {
            setIsResettingPassword(false);
        }
    }

    return (
        <>
            <div className="login-wrapper">
                <div className="login-wrapper-animate"></div>
                <div className="login-container">
                    <form className="login-container-form" onSubmit={handleLoginFormSubmitted}>
                        <h2 className="login-form-header">Reset New Password</h2>
                        <div className="input-group">
                            <label htmlFor="email">New Password</label>
                            <input type="password" 
                                id="password"
                                name="password"
                                placeholder="Enter your new password"
                                required 
                                onChange={handleResetPasswordFormChanged}/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Retype new password</label>
                            <input type="password" 
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Retype your new password"
                                required 
                                onChange={handleResetPasswordFormChanged}/>
                        </div>

                        <button type="submit" className="login-submit-button" disabled={isRessettingPassword}>
                            {isRessettingPassword ? "Resetting..." : "Reset Password"}
                        </button>

                        <div className="forgot-password-link">
                            <label>Login <a href="/login">here</a></label>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ResetPasswordForm;