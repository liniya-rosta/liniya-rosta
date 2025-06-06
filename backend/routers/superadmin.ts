import express from "express";
import {authSuperAdmin} from "../middleware/authSuperAdmin";
import User from "../models/User";

const superadminRouter = express.Router();
superadminRouter.use(authSuperAdmin);

superadminRouter.get("/admins", async (_req, res, next) => {
    try {
        const admins = await User.find();
        res.send(admins);
    } catch (e) {
        next(e);
    }
});

superadminRouter.post("/admins", async (req, res, next) => {
    try {
        const {email, password, confirmPassword, displayName, role} = req.body;

        if (!email || !password || !confirmPassword || !role) {
            res.status(400).send({error: "Все поля обязательны"});
            return;
        }

        if (!["admin", "superadmin"].includes(role)) {
            res.status(400).send({error: "Недопустимая роль"});
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
            message: "Админ создан успешно",
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

superadminRouter.delete("/admins/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return;
        }

        res.send({message: "Админ удалён"});
    } catch (e) {
        next(e);
    }
});

export default superadminRouter;