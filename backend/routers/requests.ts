import express from "express";
import RequestFromClient from "../models/Request";
import mongoose from "mongoose";

const requestRouter = express.Router();

requestRouter.post('/', async (req, res) => {
        try {
            const {name, phone, email} = req.body;
            if (!name.trim()  || !phone.trim() || !email.trim()) {
                res.status(400).send({error: "Поля имя, номер, почта обязательны"});
                return;
            }

            const request = new RequestFromClient({
                name,
                phone,
                email
            });

            await request.save();
            res.send({message: "Заявка отправлена"});
        } catch (e) {
            if (e instanceof mongoose.Error.ValidationError) {
                const error = Object.values(e.errors)[0]?.message;
                res.status(400).send({ message: error });
                return
            }
            res.status(500).send({ message: "Что-то пошло не так" });
        }
});

export default requestRouter