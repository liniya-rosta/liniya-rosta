import express from "express";
import {PortfolioItem} from "../../models/PortfolioItem";
import {portfolioImage} from "../../middleware/multer";
import mongoose, {Types} from "mongoose";
import {deleteOrReplaceImages} from "../../middleware/deleteImages";
import {deleteOrReplaceGalleryImage} from "../../middleware/deleteImagesGallery";
import {translateYandex} from "../../../translateYandex";
import {GalleryUpdate} from "../../../types";
import slugify from "slugify";
import {deleteOrReplaceSubImage} from "../../middleware/deleteImagesGallery";

const portfolioSuperAdminRouter = express.Router();

portfolioSuperAdminRouter.post(
    "/",
    portfolioImage.fields([
        {name: "cover", maxCount: 1},
        {name: "gallery"}
    ]),
    async (req, res, next) => {
        try {
            const files = req.files as {
                [fieldName: string]: Express.Multer.File[];
            };

            const coverFile = files.cover?.[0];
            const galleryFiles = files.gallery || [];

            if (galleryFiles.length === 0) {
                res.status(400).json({error: "Добавьте хотя бы одно изображение в галерею."});
                return;
            }

            const alts: string[] = Array.isArray(req.body.alt)
                ? req.body.alt
                : [req.body.alt];

            const altsKy = await Promise.all(alts.map(alt => translateYandex(alt, "ky")));

            const gallery = galleryFiles.map((file, i) => ({
                image: "portfolio/" + file.filename,
                alt: {
                    ru: alts[i],
                    ky: altsKy[i]
                },
            }));

            const descriptionKy = await translateYandex(req.body.description, "ky");
            const coverAltKy = await translateYandex(req.body.coverAlt, "ky");

            const newItem = new PortfolioItem({
                cover: coverFile ? `portfolio/${coverFile.filename}` : null,
                gallery,
                description: {
                    ru: req.body.description,
                    ky: descriptionKy
                },
                coverAlt: {
                    ru: req.body.coverAlt,
                    ky: coverAltKy
                },
                seoTitle: req.body.seoTitle || null,
                seoDescription: req.body.seoDescription || null,
            });

            await newItem.save();
            res.send(newItem);
        } catch (e) {
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).send(e);
                return
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
        req => (req.file ? [`portfolio/${req.file.filename}`] : []),
        "replace"
    ),
    async (req, res, next) => {
        try {
            const {id} = req.params;

            if (!Types.ObjectId.isValid(id)) {
                res.status(400).send({error: "Неверный формат ID обложки портфолио"});
                return;
            }

            const updateData: any = {};

            const descriptionKy = await translateYandex(req.body.description, "ky");
            const coverAltKy = await translateYandex(req.body.coverAlt, "ky");

            if (req.file) {
                updateData.cover = "portfolio/" + req.file.filename;
            }
            if (req.body.description !== undefined) {
                updateData.description = {
                    ru: req.body.description,
                    ky: descriptionKy
                };
            }
            if (req.body.coverAlt !== undefined) {
                updateData.coverAlt = {
                    ru: req.body.coverAlt,
                    ky: coverAltKy
                };
            }
            if (req.body.seoTitle !== undefined) updateData.seoTitle = req.body.seoTitle;
            if (req.body.seoDescription !== undefined) updateData.seoDescription = req.body.seoDescription;
            if (req.body.slug !== undefined) updateData.slug = req.body.slug;

            if (req.body.slug === undefined && (req.body.coverAlt || req.body.description)) {
                const baseSlug = slugify(req.body.coverAlt || req.body.description || "portfolio", {
                    lower: true,
                    strict: true
                });
                let uniqueSlug = baseSlug;
                let counter = 1;
                while (await PortfolioItem.exists({slug: uniqueSlug, _id: {$ne: id}})) {
                    uniqueSlug = `${baseSlug}-${counter}`;
                    counter++;
                }
                updateData.slug = uniqueSlug;
            }

            const updatedItem = await PortfolioItem.findByIdAndUpdate(
                id,
                updateData,
                {new: true, runValidators: true}
            ).select("-gallery");

            if (!updatedItem) {
                res.status(404).send({message: "Элемент не найден"});
                return;
            }

            res.send(updatedItem);
        } catch (e) {
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).send(e);
                return;
            }
            next(e);
        }
    }
);

portfolioSuperAdminRouter.patch(
    "/gallery/:id",
    portfolioImage.single("gallery"),
    deleteOrReplaceSubImage(PortfolioItem, {
        path: "gallery",
        key: "image",
        mode: "replace"
    }),
    async (req, res, next) => {
        try {
            const {id} = req.params;
            if (!Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID элемента галереи" });
                return;
            }

            const file = req.file;
            const newAlt = req.body.alt;

            const updateFields: GalleryUpdate = {};
            if (file) updateFields["gallery.$.image"] = `portfolio/${file.filename}`;
            if (newAlt !== undefined) {
                const altKy = await translateYandex(newAlt, "ky");
                updateFields["gallery.$.alt.ru"] = newAlt;
                updateFields["gallery.$.alt.ky"] = altKy;
            }

            if (Object.keys(updateFields).length === 0) {
                res.status(400).send({error: "Нет данных для обновления"});
                return;
            }

            const updated = await PortfolioItem.updateOne(
                {"gallery._id": id},
                {$set: updateFields}
            );

            if (updated.modifiedCount === 0) {
                res.status(400).send({error: "Обновление не выполнено"});
                return;
            }

            const refreshed = await PortfolioItem.findOne({ "gallery._id": id });
            res.send(refreshed);
        } catch (e) {
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
                res.status(404).send({error: "Элемент не найден"});
                return
            }
            res.send({message: "Удаление портфолио успешно"});
        } catch (e) {
            next(e);
        }
    }
);

portfolioSuperAdminRouter.delete(
    "/gallery/:id",
    deleteOrReplaceSubImage(PortfolioItem, {
        path: "gallery",
        key: "image",
        mode: "delete"
    }),
    async (req, res, next) => {
        try {
            const {id} = req.params;
            if (!Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID элемента галереи" });
                return;
            }

            const updated = await PortfolioItem.updateOne(
                {"gallery._id": id},
                {$pull: {gallery: {_id: id}}}
            );

            if (updated.modifiedCount === 0) {
                res.status(404).send({error: "Элемент галереи не найден"});
                return
            }

            res.send({message: "Изображение галереи удалено"});
        } catch (e) {
            next(e);
        }
    }
);

export default portfolioSuperAdminRouter;