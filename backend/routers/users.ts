import express from "express";
import User from "../modules/User";
import jwt from "jsonwebtoken";
import { authAdmin, RequestWithUser } from "../middleware/authAdmin";

const usersRouter = express.Router();

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

usersRouter.post("/sessions", async (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        res.status(400).send({ error: "Email and password are required" });
        return
    }

    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(404).send({ error: "User not found" });
            return
        }

        const isMatch = await user.checkPassword(req.body.password);
        if (!isMatch) {
            res.status(400).send({ error: "Invalid password" });
            return
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.send({
            message: "Login successful",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
            accessToken,
        });
    } catch (e) {
        next(e);
    }
});

usersRouter.delete("/sessions", authAdmin, async (req: RequestWithUser, res, next) => {
    try {
        const user = await User.findById(req.user!._id);
        if (!user) {
            res.status(404).send({ error: "User not found" });
            return
        }

        user.refreshToken = "";
        await user.save();

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.send({ message: "Logout successful" });
    } catch (error) {
        next(error);
    }
});

usersRouter.post("/refresh-token", async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(401).send({ error: "No refresh token provided" });
            return
        }

        let payload: any;
        try {
            payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        } catch {
            res.status(401).send({ error: "Invalid refresh token" });
            return
        }

        const user = await User.findById(payload._id);
        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).send({ error: "Refresh token mismatch" });
            return
        }

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.send({ accessToken: newAccessToken });
    } catch (e) {
        res.status(500).send({ error: "Internal server error" });
    }
});

export default usersRouter;
