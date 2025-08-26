import User, {generateAccessToken, generateRefreshToken, JWT_REFRESH_SECRET, JWT_SECRET} from "../models/User";
import {Request, Response, NextFunction} from "express";
import {RequestWithUser} from "../middleware/authAdmin";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).send({error: "Email и пароль обязательны"});
            return;
        }

        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return;
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            res.status(400).send({error: "Пароль неверный"});
            return;
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        const safeUser = {
            _id: user._id,
            role: user.role,
            displayName: user.displayName,
        };

        res.send({
            message: "Почта и пароль корректны",
            user: safeUser,
            accessToken,
        });
    } catch (e) {
        next(e);
    }
}

export const logout = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.send({message: "Вы успешно вышли"});
            return;
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            res.send({message: "Вы успешно вышли"});
            return;
        }

        let payload: { _id: string; role: string };
        try {
            payload = jwt.verify(token, JWT_SECRET) as { _id: string; role: string };
        } catch {
            res.send({message: "Вы успешно вышли"});
            return;
        }

        const user = await User.findById(payload._id);
        if (!user) {
            res.send({message: "Вы успешно вышли"});
            return;
        }
        user.refreshToken = "";
        await user.save();
        res.send({message: "Вы вышли успешно"});
    } catch (error) {
        next(error);
    }
}

export const refreshToken = async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(403).send({error: "Refresh-токен отсутствует"});
        return;
    }

    try {
        const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as {
            _id: string;
        };

        const user = await User.findById(payload._id);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(403).send({error: "Некорректный refresh-токен"});
            return;
        }

        const newAccessToken = generateAccessToken(user);
        res.send({accessToken: newAccessToken});
    } catch (e) {
        res.status(403).send({error: "Недействительный или истёкший refresh-токен"});
    }
}

export const editProfile = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
        const {password, email, displayName} = req.body;
        const user = await User.findById(req.user?._id);
        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return;
        }

        if (typeof password === 'string' && password.trim()) {
            const trimmed = password.trim();
            user.password = trimmed;
            user.confirmPassword = trimmed;
        }

        if (typeof email === 'string') {
            const trimmed = email.trim();
            if (trimmed && trimmed !== user.email) {
                const exists = await User.findOne({email: trimmed});
                if (exists) {
                    res.status(400).send({error: "Email уже используется"});
                    return;
                }
                user.email = trimmed;
            }
        }

        if (typeof displayName === 'string') {
            const trimmed = displayName.trim();
            if (trimmed) {
                user.displayName = trimmed;
            }
        }

        await user.save();
        res.send({
            message: "Профиль успешно обновлён",
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
            },
        });
    } catch (e) {
        next(e);
    }
};