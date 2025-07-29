const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        if (!req.cookies) {
            return res.status(401).json({ 
                success: false, 
                message: 'No cookies found. Please login again.' 
            });
        }
        const token = req.cookies['auth-token'];
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'Access denied. No auth token provided.' 
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth verification error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token. Please login again.',
                jwtExpired:true,
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired. Please login again.',
                jwtExpired:true 
            });
        }
        
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error during authentication.' 
        });
    }
};

module.exports = authMiddleware;
