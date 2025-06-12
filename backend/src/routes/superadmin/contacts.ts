import express from "express";
import mongoose from "mongoose";
import Contact from "../../models/Contact";

const contactsAdminRouter = express.Router();

contactsAdminRouter.post("/", async (req, res, next) => {
    try {
        const existing = await Contact.findOne();
        if (existing) {
            res.status(400).send({error: "Контакт уже существует. Измените его вместо создания нового."});
            return;
        }

        const {location, phone1, phone2, email, workingHours, linkLocation, mapLocation} = req.body;

        if (!location || !phone1 || !email || !workingHours || !linkLocation || !mapLocation) {
            res.status(400).send({error: "Все обязательные поля должны быть заполнены"});
            return;
        }

        const contact = new Contact({location, phone1, phone2, email, workingHours, linkLocation, mapLocation});
        await contact.save();
        res.send({message: "Контакт успешно создан", contact});
    } catch (e) {
        next(e);
    }
});

contactsAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID контакта"});
            return;
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            res.status(404).send({error: "Контакт не найден"});
            return;
        }

        const {location, phone1, phone2, email, workingHours, linkLocation, mapLocation} = req.body;

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).send({error: "Неверный формат email"});
            return;
        }

        if (location !== undefined) contact.location = location;
        if (phone1 !== undefined) contact.phone1 = phone1;
        if (phone2 !== undefined) contact.phone2 = phone2;
        if (email !== undefined) contact.email = email;
        if (workingHours !== undefined) contact.workingHours = workingHours;
        if (linkLocation !== undefined) contact.linkLocation = linkLocation;
        if (mapLocation !== undefined) contact.mapLocation = mapLocation;

        await contact.save();
        res.send({message: "Контакт успешно обновлён", contact});
    } catch (e) {
        next(e);
    }
});

contactsAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID контакта"});
            return;
        }

        const contact = await Contact.findByIdAndDelete(id);
        if (!contact) {
            res.status(404).send({error: "Контакт не найден"});
            return;
        }
        res.send({message: "Контакт успешно удалён"});
    } catch (e) {
        next(e);
    }
});

export default contactsAdminRouter;
