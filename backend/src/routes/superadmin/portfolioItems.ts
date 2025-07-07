import express from "express";
import { PortfolioItem } from "../../models/PortfolioItem";
import { portfolioImage } from "../../middleware/multer";
import { Error, Types } from "mongoose";
import { deleteOrReplaceImages } from "../../middleware/deleteImages";

const portfolioSuperAdminRouter = express.Router();

portfolioSuperAdminRouter.post(
    "/",
    portfolioImage.fields([
        { name: "cover", maxCount: 1 },
        { name: "gallery" }
    ]),
    async (req, res, next) => {
        try {
            const files = req.files as {
                [fieldname: string]: Express.Multer.File[];
            };

            const coverFile = files.cover?.[0];
            const galleryFiles = files.gallery || [];

            if (galleryFiles.length === 0) {
                res.status(400).json({ error: "Добавьте хотя бы одно изображение в галерею." });
                return;
            }

            const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];

            const gallery = galleryFiles.map((file, i) => ({
                image: "portfolio/" + file.filename,
                alt: alts[i],
            }));

            const newItem = new PortfolioItem({
                cover: coverFile ? "portfolio/" + coverFile.filename : null,
                gallery,
                description: req.body.description,
                coverAlt: req.body.coverAlt,
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
    }
);

portfolioSuperAdminRouter.patch(
    "/:id",
    portfolioImage.single("cover"),

    deleteOrReplaceImages(
        PortfolioItem,
        doc => (doc.cover ? [doc.cover] : []),
        req => req.file ? [`portfolio/${req.file.filename}`] : [],
        "replace"
    ),

    async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID обложки портфолио" });
                return;
            }

            const updateData: any = {};

            if (req.file) {
                updateData.cover = "portfolio/" + req.file.filename;
            }

            if (req.body.description !== undefined) {
                updateData.description = req.body.description;
            }

            if (req.body.coverAlt !== undefined) {
                updateData.coverAlt = req.body.coverAlt;
            }

            const updatedItem = await PortfolioItem.findByIdAndUpdate(
                id,
                updateData,
                { new: true, runValidators: true }
            ).select("-gallery");

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
    }
);

portfolioSuperAdminRouter.delete(
    "/:id",
    deleteOrReplaceImages(
        PortfolioItem,
        (doc) => {
            const images = doc.gallery.map((item: { image: string }) => item.image);
            if (doc.cover) images.push(doc.cover);
            return images;
        }
    ),
    async (req, res, next) => {
        try {
            const item = await PortfolioItem.findByIdAndDelete(req.params.id);
            if (!item) {
                res.status(404).send({ error: "Элемент не найден" });
                return;
            }
            res.send({ message: "Удаление портфолио успешно" });
        } catch (e) {
            next(e);
        }
    }
);

export default portfolioSuperAdminRouter;