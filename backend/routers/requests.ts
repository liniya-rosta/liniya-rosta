import express from "express";
import RequestFromClient from "../models/Request";

const requestRouter = express.Router();

requestRouter.post('/', async (req, res, next) => {
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
});

export default requestRouter