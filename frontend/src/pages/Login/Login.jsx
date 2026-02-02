import "./Login.css";

const Login = () => {
    return (
        <>
            <div className="login-wrapper">
                <div className="login-wrapper-animate"></div>
                <div className="login-container">
                    <form className="login-container-form">
                        <h2 className="login-form-header">Login</h2>
                        <div className="input-group">
                            <label htmlFor="username">Username or Email</label>
                            <input type="text" id="username" name="username" placeholder="Enter your username or email" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" placeholder="Enter your password" required />
                        </div>

                        <button type="submit" className="login-submit-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Login;