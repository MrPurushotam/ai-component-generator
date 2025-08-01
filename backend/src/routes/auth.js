const router = require("express").Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.middleware');
const prisma = require("../utils/prismaClient");
const UserDetailsMap = require("../utils/InMemoryMap");
const { signInLimiter } = require("../utils/rateLimiting");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", signInLimiter, async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ message: "ID token is required", success: false });
        }

        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;
        let user = await prisma.user.findUnique({
            where: { googleId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId,
                    email,
                    name,
                    picture,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    picture: true,
                    tokenLimit: true
                }
            });
        } else {
            user = await prisma.user.update({
                where: { googleId },
                data: {
                    email,
                    name,
                    picture
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    picture: true,
                    tokenLimit: true
                }
            });
        }
        let userDetails = {
            userId: user.id,
            email: user.email,
            username: user.name,
            picture: user.picture,
            tokenLimit: user.tokenLimit
        }

        const customToken = jwt.sign(userDetails, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.cookie('auth-token', customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            domain: process.env.NODE_ENV === 'production' ? "purushotamjeswani.in" : "*",
            path: '/'
        });
        UserDetailsMap.set(customToken, userDetails)
        res.json({
            token: customToken,
            user: userDetails,
            success: true
        });

    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ message: "Authentication failed", success: false });
    }
})

router.post("/logout", (req, res) => {
    res.clearCookie('auth-token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? "purushotamjeswani.in" : "*",
        path: '/'
    });
    UserDetailsMap.delete(req.token)
    res.json({ message: "Logged out successfully", success: true });
})

router.get("/", authMiddleware, async (req, res) => {
    try {
        const cachedUser = UserDetailsMap.get(req.token);
        if (cachedUser) {
            return res.json({
                user: {
                    userId: cachedUser.userId,
                    email: cachedUser.email,
                    username: cachedUser.username,
                    picture: cachedUser.picture,
                    tokens: cachedUser.tokenLimit
                },
                success: true
            });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.userId }
        });

        if (!user) {
            return res.status(401).json({ message: "User not found", success: false });
        }

        res.json({
            user: {
                userId: user.id,
                email: user.email,
                username: user.name,
                picture: user.picture,
                tokens: user.tokenLimit
            },
            success: true
        });

    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(500).json({ message: "Server error", success: false });
    }
})

router.get("/key", async (req, res) => {
    const userId = req.user.userId;
    if (!userId) {
        return res.status(401).json({ message: "User Unauthorized", success: false });
    }

    try {
        const resp = await prisma.user.findUnique({
            where: {
                id: userId
            }, select: {
                customApiKey: true
            }
        })
        return res.status(200).json({ message: 'Fetched user custom key.', key: resp.customApiKey })
    } catch (error) {
        console.log("Error occured while fetching user key ", error);
        res.status(500).json({ message: "Internal Server error", success: false });
    }

})

module.exports = router;