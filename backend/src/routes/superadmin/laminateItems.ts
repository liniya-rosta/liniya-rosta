import express from 'express';
import mongoose from "mongoose";
import {laminateImage} from "../../middleware/multer";
import LaminateItem from "../../models/LaminateItem";

const laminateItemsSuperAdminRouter = express.Router();

laminateItemsSuperAdminRouter.post("/", laminateImage.single("image"), async (req, res, next) => {
    try {
        const {title, description} = req.body;
        if (!title || !title.trim() || !req.file) {
            res.status(400).send({error: "Заголовок и изображение обязательны"});
            return;
        }

        const laminateItem = new LaminateItem({
            title: title.trim(),
            description: description ? description.trim() : null,
            image: `/laminate-item/${req.file.filename}`,
        });

        await laminateItem.save();
        res.send({message: "Продукт создан успешно", laminateItem});
    } catch (e) {
        next(e);
    }
});

laminateItemsSuperAdminRouter.patch("/:id", laminateImage.single("image"), async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body;

        if (!title && !description && !req.file) {
            res.status(400).send({error: "Не указаны поля для обновления"});
            return;
        }

        const laminateItem = await LaminateItem.findById(id);
        if (!laminateItem) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }

        if (title && !title.trim()) {
            res.status(400).send({error: "Заголовок не может быть пустым"});
            return;
        }

        if (description?.trim() === '') {
            res.status(400).send({error: "Описание не может быть пустым"});
            return;
        }

        if (title) laminateItem.title = title.trim();
        if (description !== undefined) laminateItem.description = description;
        if (req.file) laminateItem.image = `/laminate-item/${req.file.filename}`;

        await laminateItem.save();
        res.send({message: "Продукт обновлен успешно", laminateItem});
    } catch (e) {
        next(e);
    }
});

laminateItemsSuperAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).send({error: "Неверный формат ID продукта"});
            return;
        }

        const laminateItem = await LaminateItem.findByIdAndDelete(req.params.id);
        if (!laminateItem) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }
        res.send({message: "Продукт успешно удален"});
    } catch (e) {
        next(e);
    }
});

export default laminateItemsSuperAdminRouter;