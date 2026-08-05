const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the authorization header from the request
    const authHeader = req.headers['authorization'];
    
    // The header usually looks like "Bearer eyJhbGciOi..."
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        // Verify the token using your secret key from the .env file
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach user data to the request object
        next(); // Move on to the actual route handler
    } catch (err) {
        res.status(403).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = verifyToken;