import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User, { JWT_SECRET } from "../models/User";

export interface RequestWithUser extends Request {
    user?: { _id: string; role: string };
}

export const authSuperAdmin = async (
    req: RequestWithUser,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).send({ error: "Токен не предоставлен" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, JWT_SECRET) as {
            _id: string;
            role: string;
        };

        const user = await User.findById(payload._id).select("role");
        if (!user) {
             res.status(401).send({ error: "Пользователь не найден" });
             return;
        }

        if (user.role !== "superadmin") {
            res.status(403).send({ error: "Доступ только для суперадмина" });
            return;
        }

        req.user = { _id: user._id.toString(), role: user.role };
        next();
    } catch {
        res.status(401).send({ error: "Неверный токен" });
        return;
    }
};
