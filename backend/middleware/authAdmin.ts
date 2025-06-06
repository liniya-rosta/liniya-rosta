import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_fallback_secret";

export interface RequestWithUser extends Request {
    user?: { _id: string; role: string };
}

export const authAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({ error: "No token provided" });
        return
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { _id: string; role: string };
        if (payload.role !== "admin" && payload.role !== "superadmin") {
            res.status(403).send({ error: "Forbidden" });
            return
        }
        req.user = payload;
        next();
    } catch {
        res.status(401).send({ error: "Invalid token" });
        return
    }
};