import express from "express";
import User from "../../models/User";
import {RequestWithUser} from "../../middleware/authAdmin";
import {sendAdminMail} from "../resendAdminEmail";
import {authSuperAdmin} from "../../middleware/authSuperAdmin";

const superAdminPrivateRouter = express.Router();

superAdminPrivateRouter.get("/", async (_req, res, next) => {
    try {
        const admins = await User.find().select("-refreshToken");
        res.send(admins);
    } catch (e) {
        next(e);
    }
});

superAdminPrivateRouter.post("/", authSuperAdmin, async (req, res, next) => {
    try {
        const {email, password, confirmPassword, displayName, role} = req.body;

        if (!email || !password || !confirmPassword || !role) {
            res.status(400).send({error: "Все поля обязательны"});
            return;
        }

        if (role !== "superadmin" && role !== "admin") {
            res.status(400).send({error: "Недопустимая роль"});
            return;
        }

        const existingUser = await User.findOne({email});
        if (existingUser) {
            res.status(400).send({error: "Пользователь с таким email уже существует"});
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

        if (user.role === "admin") {
            await sendAdminMail(user.email, user.displayName, 'админом');
        }

        if (user.role === "superadmin") {
            await sendAdminMail(user.email, user.displayName, 'супер-админом');
        }

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

superAdminPrivateRouter.patch("/:id", authSuperAdmin, async (req: RequestWithUser, res, next) => {
    try {
        const {id} = req.params;
        const {role, email, displayName} = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return
        }

        const isSelf = req.user?._id === id;
        const previousRole = user.role;

        if (role) {
            if (role !== "admin" && role !== "superadmin") {
                res.status(400).send({error: "Недопустимая роль"});
                return;
            }

            const isDowngrade = user.role === "superadmin" && role === "admin";
            if (isSelf && isDowngrade) {
                const superadminsCount = await User.countDocuments({role: "superadmin"});
                if (superadminsCount <= 1) {
                    res.status(400).send({error: "Нельзя понизить себя – вы единственный superadmin"});
                    return;
                }
            }

            user.role = role;
        }

        if (email && email !== user.email) {
            const existing = await User.findOne({email});
            if (existing) {
                res.status(400).send({error: "Email уже занят другим пользователем"});
                return
            }
            user.email = email;
        }

        if (displayName) user.displayName = displayName;

        await user.save();

        const isNewAdminRole =
            role &&
            (role === "admin" || role === "superadmin") &&
            role !== previousRole;

        if (isNewAdminRole) {
            const roleName = role === "admin" ? "админом" : "супер-админом";
            await sendAdminMail(user.email, user.displayName, roleName);
        }

        res.send({message: "Пользователь обновлён", user});
    } catch (e) {
        next(e);
    }
});

superAdminPrivateRouter.delete("/:id", authSuperAdmin, async (req: RequestWithUser, res, next) => {
    try {
        const {id} = req.params;

        if (req.user?._id === id) {
            res.status(400).send({error: "Нельзя удалять самого себя"});
            return;
        }

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return;
        }

        res.send({message: `${user.role === "admin" ? "Администратор" : user.role === "superadmin" ? "Суперадминистратор" : ''} удален`});
    } catch (e) {
        next(e);
    }
});

export default superAdminPrivateRouter;