import RequestFromClient from "../models/Request";
import { Request, Response, NextFunction } from "express";

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {name, phoneNumber} = req.body;
        if (!name || !phoneNumber || !name.trim()  || !phoneNumber.trim()) {
            res.status(400).send({error: "Поля имя и номер обязательны"});
            return;
        }

        const request = new RequestFromClient({
            name,
            phoneNumber
        });

        await request.save();
        res.send({message: "Заявка отправлена"});
    } catch (e) {
        next(e);
    }
}