const router = require("express").Router();
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/auth.middleware');
const prisma = require("../utils/prismaClient");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
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
        console.log(payload);
        let user = await prisma.user.findUnique({
            where: { googleId }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    googleId,
                    email,
                    name,
                    picture
                }
            });
        } else {
            user = await prisma.user.update({
                where: { googleId },
                data: {
                    email,
                    name,
                    picture
                }
            });
        }

        const customToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.name,
                picture: user.picture
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.cookie('auth-token', customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        res.json({
            token: customToken,
            user: {
                userId: user.id,
                email: user.email,
                username: user.name,
                picture: user.picture
            },
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
        path: '/'
    });
    res.json({ message: "Logged out successfully", success: true });
})

router.get("/", authMiddleware, async (req, res) => {
    try {
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
                picture: user.picture
            },
            success: true
        });

    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(500).json({ message: "Server error", success: false });
    }
})

module.exports = router;