import jwt from "jsonwebtoken";
import type {Request, Response, NextFunction} from "express";
import JWT from "../types/jwt";
import CONFIG from "../config";

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;

    if (authorization === undefined) {
        return res.status(401).json({error: "Please provide authorization token"});
    }

    if (!authorization.startsWith("Bearer ")) {
        return res.status(401).json({error: "Please provide correct authorization token"});
    }

    const accessToken = authorization.slice(7);

    jwt.verify(accessToken, CONFIG.jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === "JsonWebTokenError") {
                return res.status(401).json({error: "Access token is not valid"});
            }
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({error: "Access token is expired"});
            }
            return next(err);
        }

        req.user = {
            id: (decoded as JWT).id,
            email: (decoded as JWT).email,
            role: (decoded as JWT).role,
        };

        next();
    });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return res.status(401).json({error: "Access denied. Please login first"});
    }

    if (req.user.role !== "ADMIN") {
        return res.status(403).json({error: "Access denied. Admin privileges required"});
    }

    next();
}