import express from "express";
import jwt from "jsonwebtoken";
import {RequestWithUser} from "../middleware/authAdmin";
import User, {generateAccessToken, generateRefreshToken, JWT_REFRESH_SECRET, JWT_SECRET} from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/sessions", async (req, res, next) => {
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
            email: user.email,
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
});

usersRouter.delete("/logout", async (req: RequestWithUser, res, next) => {
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
});

usersRouter.post("/refresh-token", async (req, res, _next) => {
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
});

usersRouter.post("/", async (req, res, next) => {
    try {
        const {email, password, confirmPassword, displayName, role} = req.body;

        if (!email || !password || !confirmPassword || !role) {
            res.status(400).send({error: "Все поля обязательны"});
            return;
        }


        const user = new User({
            email,
            password,
            displayName,
            role
        });

        user.confirmPassword = confirmPassword;
        await user.save();
        res.send({
            message: `Вы успешно создали ${user.role === "admin" ? "администратора" : user.role === "superadmin" ? "суперадминистратора" : ''}`,
            user: {
                _id: user._id,
                email: user.email,
                displayName: user.displayName,
                role: user.role,
            },
        });
    } catch (e) {
        next(e);
    }
});

export default usersRouter;
