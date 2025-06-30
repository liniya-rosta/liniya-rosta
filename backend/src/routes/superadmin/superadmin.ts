import express from "express";
import User from "../../models/User";
import {RequestWithUser} from "../../middleware/authAdmin";

const superAdminPrivateRouter = express.Router();

superAdminPrivateRouter.get("/", async (_req, res, next) => {
    try {
        const admins = await User.find().select("-refreshToken");
        res.send(admins);
    } catch (e) {
        next(e);
    }
});

superAdminPrivateRouter.post("/", async (req, res, next) => {
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

superAdminPrivateRouter.patch("/:id/role", async (req: RequestWithUser, res, next) => {
    try {
        const {id} = req.params;
        const {role} = req.body;

        if (role !== "superadmin" && role !== "admin") {
            res.status(400).send({error: "Недопустимая роль"});
            return;
        }

        const user = await User.findById(id);
        if (!user) {
            res.status(404).send({error: "Пользователь не найден"});
            return;
        }

        const isSelf = req.user?._id === id;
        const isDowngrade = user.role === "superadmin" && role === "admin";

        if (isSelf && isDowngrade) {
            const superadminsCount = await User.countDocuments({role: "superadmin"});

            if (superadminsCount <= 1) {
                res.status(400).send({error: "Нельзя понизить себя – вы единственный superadmin"});
                return;
            }
        }

        user.role = role;
        await user.save();
        res.send({message: "Роль обновлена", user});
    } catch (e) {
        next(e);
    }
});

superAdminPrivateRouter.delete("/:id", async (req: RequestWithUser, res, next) => {
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