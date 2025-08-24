import express from "express";
import {PortfolioItem} from "../../models/PortfolioItem";
import {portfolioImage} from "../../middleware/multer";
import mongoose, {Types} from "mongoose";
import {translateYandex} from "../../../translateYandex";
import {GalleryUpdate, PortfolioFiles, PortfolioUpdate} from "../../../types";
import slugify from "slugify";

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

            const titleKy = await translateYandex(req.body.title, "ky");
            const descriptionKy = await translateYandex(req.body.description, "ky");
            const coverAltKy = await translateYandex(req.body.coverAlt, "ky");

            const newItem = new PortfolioItem({
                title: {
                    ru: req.body.title,
                    ky: titleKy
                },
                seoTitle: {
                    ru: req.body.seoTitle?.trim() || null,
                    ky: await translateYandex(req.body.seoTitle?.trim() || "", "ky")
                },
                seoDescription: {
                    ru: req.body.seoDescription?.trim() || null,
                    ky: await translateYandex(req.body.seoDescription?.trim() || "", "ky")
                },
                cover: coverFile ? `portfolio/${coverFile.filename}` : null,
                gallery,
                description: {
                    ru: req.body.description,
                    ky: descriptionKy
                },
                coverAlt: {
                    ru: req.body.coverAlt,
                    ky: coverAltKy
                }
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
    portfolioImage.fields([
        { name: "cover", maxCount: 1 },
        { name: "gallery" },
    ]),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const {
                title,
                description,
                seoTitle,
                seoDescription,
                coverAlt,
                slug,
                mode = "replace",
                alts: rawAlts,
            } = req.body as PortfolioUpdate;

            if (!Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID" });
                return;
            }

            const updateData: Record<string, unknown> = {};

            const files = req.files as PortfolioFiles;
            const coverFile = files?.cover?.[0];
            if (coverFile) {
                updateData.cover = "portfolio/" + coverFile.filename;
            }

            if (title !== undefined) {
                const titleKy = await translateYandex(title, "ky");
                updateData.title = { ru: title, ky: titleKy };
            }

            if (seoTitle !== undefined) {
                updateData.seoTitle = {
                    ru: seoTitle?.trim() || null,
                    ky: await translateYandex(seoTitle?.trim() || "", "ky"),
                };
            }

            if (seoDescription !== undefined) {
                updateData.seoDescription = {
                    ru: seoDescription?.trim() || null,
                    ky: await translateYandex(seoDescription?.trim() || "", "ky"),
                };
            }

            if (description !== undefined) {
                const descriptionKy = await translateYandex(description, "ky");
                updateData.description = { ru: description, ky: descriptionKy };
            }

            if (coverAlt !== undefined) {
                const coverAltKy = await translateYandex(coverAlt, "ky");
                updateData.coverAlt = { ru: coverAlt, ky: coverAltKy };
            }

            if (slug !== undefined) {
                updateData.slug = slug;
            } else if (title || coverAlt) {
                const baseSlug = slugify(title || coverAlt || "", {
                    lower: true,
                    strict: true,
                });
                let uniqueSlug = baseSlug;
                let counter = 1;
                while (
                    await PortfolioItem.exists({ slug: uniqueSlug, _id: { $ne: id } })
                    ) {
                    uniqueSlug = `${baseSlug}-${counter}`;
                    counter++;
                }
                updateData.slug = uniqueSlug;
            }

            const galleryFiles = files?.gallery || [];
            const alts = Array.isArray(rawAlts)
                ? rawAlts
                : rawAlts
                    ? [rawAlts]
                    : [];

            if (galleryFiles.length > 0) {
                const altsKy = await Promise.all(
                    alts.map((alt) => translateYandex(alt, "ky"))
                );

                const newGalleryItems = galleryFiles.map((file, i) => ({
                    image: "portfolio/" + file.filename,
                    alt: {
                        ru: alts[i] || null,
                        ky: altsKy[i] || null,
                    },
                }));

                if (mode === "append") {
                    await PortfolioItem.findByIdAndUpdate(
                        id,
                        { $push: { gallery: { $each: newGalleryItems } }, ...updateData },
                        { new: true, runValidators: true }
                    );
                } else {
                    updateData.gallery = newGalleryItems;
                }
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
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).send(e);
                return;
            }
            next(e);
        }
    }
);

portfolioSuperAdminRouter.patch("/gallery/:galleryId", portfolioImage.single("gallery"),
    async (req, res, next) => {
        try {
            const {galleryId} = req.params;
            if (!Types.ObjectId.isValid(galleryId)) {
                res.status(400).send({error: "Неверный формат ID элемента галереи"});
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
                {"gallery._id": galleryId},
                {$set: updateFields}
            );

            if (updated.modifiedCount === 0) {
                res.status(400).send({error: "Обновление не выполнено"});
                return;
            }

            const refreshed = await PortfolioItem.findOne({"gallery._id": galleryId});
            res.send(refreshed);
        } catch (e) {
            next(e);
        }
    }
);

portfolioSuperAdminRouter.delete("/:id", async (req, res, next) => {
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

portfolioSuperAdminRouter.delete("/gallery/:galleryId", async (req, res, next) => {
        try {
            const {galleryId} = req.params;
            if (!Types.ObjectId.isValid(galleryId)) {
                res.status(400).send({error: "Неверный формат ID элемента галереи"});
                return
            }

            const updated = await PortfolioItem.updateOne(
                {"gallery._id": galleryId},
                {$pull: {gallery: {_id: galleryId}}}
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