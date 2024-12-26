import jwt from 'jsonwebtoken';
const SECRET_KEY = 'your_jwt_secret_key';
const authMiddleware = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;