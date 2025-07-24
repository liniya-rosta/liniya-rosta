import express from "express";
import mongoose from "mongoose";
import Contact from "../../models/Contact";
import {translateYandex} from "../../../translateYandex";

const contactsAdminRouter = express.Router();

type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

type WorkingHoursType = {
    [key in Day]: {
        ru: string;
        ky: string;
    };
};

const days: Day[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday"
];

contactsAdminRouter.post("/", async (req, res, next) => {
    try {
        const existing = await Contact.findOne();
        if (existing) {
            res.status(400).send({error: "Контакт уже существует. Измените его вместо создания нового."});
            return;
        }

        const {
            location,
            phone1,
            phone2,
            email,
            workingHours,
            linkLocation,
            mapLocation,
            instagram,
            whatsapp,
        } = req.body;

        if (
            !location.ru || !phone1 || !email || !workingHours || !linkLocation ||
            !mapLocation || !instagram || !whatsapp
        ) {
            res.status(400).send({error: "Все обязательные поля должны быть заполнены"});
            return;
        }

        const translatedLocation = await translateYandex(location.ru, "ky");

        const translatedWorkingHours: Record<string, { ru: string; ky: string }> = {};

        for (const day of days) {
            const ruText: string = workingHours[day].ru;
            if (!ruText) {
                res.status(400).send({error: `Не указано время для дня: ${day}`});
                return;
            }

            const kyText = await translateYandex(ruText, "ky");
            translatedWorkingHours[day] = {
                ru: ruText,
                ky: kyText
            };
        }

        const contact = new Contact({
            location: {
                ru: location.ru,
                ky: translatedLocation
            },
            phone1,
            phone2,
            email,
            workingHours: translatedWorkingHours,
            linkLocation,
            mapLocation,
            instagram,
            whatsapp,
        });

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

        const {
            location,
            phone1,
            phone2,
            email,
            workingHours,
            linkLocation,
            mapLocation,
            instagram,
            whatsapp,
        } = req.body;

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            res.status(400).send({error: "Неверный формат email"});
            return;
        }

        if (location !== undefined) {
            const translatedLocation = await translateYandex(location.ru, "ky");
            contact.location = {
                ru: location.ru,
                ky: translatedLocation,
            };
        }

        if (workingHours !== undefined) {

            const translatedWorkingHours: WorkingHoursType = {
                monday: { ru: "", ky: "" },
                tuesday: { ru: "", ky: "" },
                wednesday: { ru: "", ky: "" },
                thursday: { ru: "", ky: "" },
                friday: { ru: "", ky: "" },
                saturday: { ru: "", ky: "" },
                sunday: { ru: "", ky: "" },
            };

            for (const day of days) {
                const ruText = workingHours[day]?.ru;
                if (!ruText) {
                    res.status(400).send({ error: `Не указано время для дня: ${day}` });
                    return;
                }
                const kyText = await translateYandex(ruText, "ky");
                translatedWorkingHours[day] = { ru: ruText, ky: kyText };
            }

            contact.workingHours = translatedWorkingHours;

        }

        if (phone1 !== undefined) contact.phone1 = phone1;
        if (phone2 !== undefined) contact.phone2 = phone2;
        if (email !== undefined) contact.email = email;
        if (linkLocation !== undefined) contact.linkLocation = linkLocation;
        if (mapLocation !== undefined) contact.mapLocation = mapLocation;
        if (instagram !== undefined) contact.instagram = instagram;
        if (whatsapp !== undefined) contact.whatsapp = whatsapp;

        await contact.save();
        res.send({message: "Контакт успешно обновлён", contact});
    } catch (e) {
        next(e);
    }
});

export default contactsAdminRouter;
