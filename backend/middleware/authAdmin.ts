import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "../models/User";

export interface RequestWithUser extends Request {
    user?: { _id: string; role: string };
}

export const authAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({ error: "Токен не предоставлен" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { _id: string; role: string };
        if (payload.role !== "admin" && payload.role !== "superadmin") {
            res.status(403).send({ error: "Доступ запрещен" });
            return
        }
        req.user = payload;
        next();
    } catch {
        res.status(401).send({ error: "Неверный токен" });
        return
    }
};