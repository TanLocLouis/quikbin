import authService from '../services/authService.js';

async function signUp(req, res) {
    const { username, email, password } = req.body;
    try {
        const newUser = await authService.signUp({ username, email, password });
        res.status(201).json(newUser);
    } catch (err) {
        if (err.code === 'USER_EXISTS') {
            res.status(409).json({ 
                error: 'USER_EXISTS',
                message: 'User already exists'
            });
            return;
        }

        console.error('[ERROR] Failed to sign up user', err);
        res.status(500).json({ 
            error: 'SIGNUP_FAILED',
            message: 'Failed to sign up user'
        });
    }
}

async function verifyAccount(req, res) {
    const { token } = req.query;
    try {
        await authService.verifyAccount(token);
        // res.status(200).json({
        //     status: 'SUCCESS', 
        //     message: 'Account verified successfully' 
        // });

        res.redirect('http://localhost:5173/verify-sign-up');
    } catch (err) {
        if (err.code === 'INVALID_TOKEN' || err.code === 'TOKEN_EXPIRED') {
            res.status(400).json({ 
                error: err.code,
                message: err.message 
            });
            return;
        }
        console.error('[ERROR] Failed to verify account', err);
        res.status(500).json({ 
            error: 'VERIFICATION_FAILED',
            message: 'Failed to verify account' 
        });
    }
}

async function login(req, res) {
    const { username, password } = req.body;
    try {
        const user = await authService.login(username, password);
        res.status(200).json( user );
    } catch (err) {
        if (err.code === 'ACCOUNT_INACTIVE') {
            res.status(400).json({ 
                error: err.code,
                message: 'Account is not verified' 
            });
            return;
        }

        if (err.code === "INVALID_PASSWORD") {
            res.status(400).json({ 
                error: err.code,
                message: 'Invalid password' 
            });
            return;
        }
        
        console.error('[ERROR] Failed to login user', err);
        res.status(500).json({ 
            error: 'LOGIN_FAILED',
            message: 'Failed to login user' 
        });
    }
}

async function refreshToken(req, res) {
    const { refreshToken } = req.body;

    try {
        const newAccessToken = await authService.refreshToken(refreshToken);
        res.status(200).json(
            { accessToken: newAccessToken }
        );
    } catch (err) {
        if (err.code === 'INVALID_TOKEN' || err.code === 'TOKEN_EXPIRED') {
            res.status(400).json({ 
                error: err.code,
                message: err.message 
            });
            return;
        }
        console.error('[ERROR] Failed to refresh token', err);
        res.status(500).json({ 
            error: 'REFRESH_TOKEN_FAILED',
            message: 'Failed to refresh token' 
        });
    }
}

export default {
    signUp,
    verifyAccount,
    login,
    refreshToken
}