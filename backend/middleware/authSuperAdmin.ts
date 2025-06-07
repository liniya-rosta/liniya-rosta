import {NextFunction, Response} from "express";
import {RequestWithUser} from "./authAdmin";

export const authSuperAdmin = (req: RequestWithUser, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user || user.role !== "superadmin") {
        res.status(403).send({error: "Доступно только для супер-админов"});
        return;
    }
    next();
};
