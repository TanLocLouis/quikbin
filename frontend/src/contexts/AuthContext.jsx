import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import { useNavigate } from "react-router";


const AuthContext = createContext();

const AuthProvider = ( { children } ) => {
    const [accessToken, setAccessToken] = useState(null);
    const [userInfo, setUserInfo] = useState(localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null);

    const { addToast } = useToast();

    useEffect(() => {
        if (userInfo) {
            refreshToken();
        }
    }, []);

    const redirect = useNavigate();

    const signup = async (SignUpForm) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(SignUpForm)
            })

            if (!res.ok) {
                if (res.status === 409) {
                    throw { status: 409, message: "User already exists" };
                } else if (res.status === 400) {
                    const errorData = await res.json();
                    throw { status: 400, message: errorData.message || "Invalid input data" };
                }
            }

            return true;
        } catch (err) {
            if (err.status === 409) {
                addToast("error", "User already exists. Please choose a different username or email.");
            } else if (err.status === 400) {
                addToast("error", `Sign up failed: ${err.message}`);
            } else {
                addToast("error", "Sign up failed. Please try again later.");
            }
            console.error(err);

            return false;
        }
    }

    const login = async (LoginForm) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(LoginForm)
            })

            if (!res.ok) {
                const data = await res.json();
                
                if (data.error === 'ACCOUNT_INACTIVE') {
                    throw new Error("Account is not verified. Please check your email for the verification link.");
                }

                if (data.error === 'INVALID_CREDENTIALS') {
                    throw new Error("Invalid username or password. Please try again.");
                }

                throw new Error("Account is not verified.");
            }

            const data = await res.json();

            setAccessToken(data.accessToken);
            setUserInfo(data.data);
            localStorage.setItem("refreshToken", data.refreshToken);
            localStorage.setItem("userInfo", JSON.stringify(data.data));
            // addToast("info", "Login successful!");

            return true;
        } catch (err) {
            console.error(err);
            addToast("error", err.message || "Login failed. Please try again later.");

            return false;
        }
    }

    const refreshToken = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh-token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
            });

            if (!res.ok) {
                const errorData = await res.json();
                
                if (errorData.error === 'INVALID_TOKEN' || errorData.error === 'TOKEN_EXPIRED') {
                    addToast("error", "Session expired. Please log in again.");
                    logout();

                    redirect("/login");
                }

                throw new Error(errorData.message || "Failed to refresh token");
            }

            // addToast("info", "Session refreshed successfully.");
            const data = await res.json();
            setAccessToken(data.accessToken);

            return true;
        } catch (err) {
            console.error("Failed to refresh token:", err.message);
            
            return false;
        }
    }

    const logout = () => {
        setAccessToken(null);
        setUserInfo(null);

        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");

        // addToast("info", "Logged out successfully.");
    }

    const value = {
        signup,
        login,
        refreshToken,
        accessToken,
        userInfo,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export { AuthProvider, useAuth };