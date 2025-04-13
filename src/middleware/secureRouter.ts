import { Request, Response, NextFunction, Router } from 'express';

// Extend the Request interface to include the 'user' property
declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}
import jwt from 'jsonwebtoken';

const secureRouter = Router();

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Access Denied: No Token Provided' });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            res.status(403).json({ message: 'Access Denied: Invalid Token' });
            return;
        }
        req.user = user as string | jwt.JwtPayload;
        next();
    });
};

// Apply the middleware to secure routes
secureRouter.use(authenticateToken);

secureRouter.get('/secure-data', (req: Request, res: Response) => {
    res.json({ message: 'This is secured data', user: req.user });
});

export default secureRouter;