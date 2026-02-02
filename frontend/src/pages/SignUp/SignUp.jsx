import { redirect } from "react-router";
import "./SignUp.css";

const SignUp = () => {

    const handleLoginClicked = () => {
        redirect("/login");
    }

    return (
        <>
            <div className="signup-wrapper">
                <div className="signup-wrapper-animate"></div>
                <div className="signup-container">
                    <form className="signup-container-form">
                        <h2 className="signup-form-header">Sign Up</h2>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" placeholder="Enter your email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required />
                        </div>

                        <button type="submit" className="signup-submit-button">
                            Create Account
                        </button>

                        <label className="signup-note">Already have an account? Login <a href="/login">here</a></label>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignUp;