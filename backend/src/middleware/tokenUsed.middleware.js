const UserDetailsMap = require('../utils/InMemoryMap');
const prisma = require('../utils/prismaClient');

async function checkTokens(req, res, next) {
    console.log(req?.token);
    if (req?.token && UserDetailsMap.get(req.token)) {
        let cachedUser = UserDetailsMap.get(req.token);
        if (cachedUser.tokenLimit <= 0) {
            return res.status(403).json({ message: "You don’t have tokens left to chat.", success: false, exhausted: true });
        }
        return next();
    }
    try {
        const userId = req.user?.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.tokenLimit <= 0) {
            return res.status(403).json({ message: "You don’t have tokens left to chat.", success: false });
        }
        next();
    } catch (error) {

    }
}

module.exports = checkTokens;