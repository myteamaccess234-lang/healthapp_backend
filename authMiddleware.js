const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];
    
    // The header format is expected to be "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: "Access denied. No authentication token provided." 
        });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error("CRITICAL ERROR: JWT_SECRET is not configured in process.env!");
        return res.status(500).json({ 
            success: false, 
            message: "Server environment configuration error." 
        });
    }

    try {
        // Verify token against secret key
        const verified = jwt.verify(token, jwtSecret);
        
        // Attach decoded user object ({ id, email, iat, exp }) to request
        req.user = verified; 
        
        next(); // Proceed to route handler
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: "Session expired. Please log in again." 
            });
        }
        
        return res.status(403).json({ 
            success: false, 
            message: "Invalid token verification failed." 
        });
    }
};

module.exports = verifyToken;
