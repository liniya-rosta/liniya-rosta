import express from "express";
import {PortfolioItem} from "../../models/PortfolioItem";
import {portfolioImage} from "../../middleware/multer";
import {Error, Types} from "mongoose";

const portfolioItemsSuperAdminRouter = express.Router();

portfolioItemsSuperAdminRouter.post("/", portfolioImage.fields([
    {name: "cover", maxCount: 1},
    {name: "gallery"}
]), async (req, res, next) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const coverFile = files.cover?.[0];
        const galleryFiles = files.gallery || [];

        if (galleryFiles.length === 0) {
            res.status(400).json({error: "Добавьте хотя бы одно изображение в галерею."});
            return;
        }

        const galleryImages = galleryFiles.map(file => ({
            image: "portfolio/" + file.filename,
        }));

        const newItem = new PortfolioItem({
            cover: coverFile ? "portfolio/" + coverFile.filename : null,
            gallery: galleryImages,
            description: req.body.description,

        });

        await newItem.save();
        res.send(newItem);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return;
        }
        next(e);
    }
});

portfolioItemsSuperAdminRouter.patch("/:id", portfolioImage.single("cover"), async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID обложки портфолио"});
            return;
        }

        const updateData: Partial<{ cover: string; description: string }> = {};

        if (req.file) {
            updateData.cover = "portfolio/" + req.file.filename;
        }

        if (req.body.description !== undefined) {
            updateData.description = req.body.description;
        }

        const updatedItem = await PortfolioItem.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            res.status(404).send({ message: "Элемент не найден" });
            return;
        }

        res.send(updatedItem);
    } catch (e) {
        if (e instanceof Error.ValidationError) {
            res.status(400).send(e);
            return;
        }
        next(e);
    }
});

portfolioItemsSuperAdminRouter.patch("/gallery/:id", portfolioImage.fields([
    {name: "gallery", maxCount: 1}
]), async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID элемента галереи"});
            return;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const file = files.gallery?.[0];

        if (!file) {
            res.status(400).send({error: "Файл изображения не загружен"});
            return;
        }

        const item = await PortfolioItem.findOne({"gallery._id": id});

        if (!item) {
            res.status(404).send({message: "Элемент галереи не найден"});
            return;
        }

        const updated = await PortfolioItem.updateOne(
            {"gallery._id": id},
            {
                $set: {
                    "gallery.$.image": file ? "portfolio/" + file.filename : null,
                },
            }
        );

        if (updated.modifiedCount === 0) {
            res.status(400).send({message: "Обновление не выполнено"});
            return;
        }

        const refreshed = await PortfolioItem.findById(item._id);
        res.send(refreshed);
    } catch (e) {
        next(e);
    }
});

portfolioItemsSuperAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID обложки портфолио"});
            return;
        }

        const item = await PortfolioItem.findByIdAndDelete(id)

        if (!item) {
            res.status(404).send({message: "Элемент галереи не найден"});
            return;
        }

        res.send({message: "Удаление обложки портфолио успешно"});
    } catch (e) {
        next(e);
    }
});

portfolioItemsSuperAdminRouter.delete("/gallery/:id", async (req, res, next) => {
    try {
        const {id} = req.params;

        const updated = await PortfolioItem.updateOne(
            { "gallery._id": id },
            { $pull: { gallery: { _id: id } } }
        );

        if (updated.modifiedCount === 0) {
            res.status(404).send({ message: "Элемент галереи не найден или уже удалён" });
            return;
        }

        res.send({message: "Удаление элемента галереи успешно"});
    } catch (e) {
        next(e);
    }
});

export default portfolioItemsSuperAdminRouter;