const rateLimit = require('express-rate-limit')

const blockedMessage = (msg, ms) => (req, res) => ({
    message: msg,
    success: false,
    rateLimit: true,
    blockedUntil: Date.now() + ms
})


const globalLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    limit: 69,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: "Too many requests, please try again later.",
        success: false,
        rateLimit: true,
        message: blockedMessage("Too many requests, please try again later.", 3 * 60 * 1000)
    }
})


const signInLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 11,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: blockedMessage("Rate limit hit, you are shadow blocked from the system until next hour.", 60 * 60 * 1000)
})

const aiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: blockedMessage("Rate limit hit, you are shadow blocked from the system until next 30 minutes.", 30 * 60 * 1000)
})


const chatCreationLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: blockedMessage("Rate limit hit, you are shadow blocked from the system until next 30 minutes.", 30 * 60 * 1000)
})


module.exports = { aiLimiter, globalLimiter, signInLimiter, chatCreationLimiter };