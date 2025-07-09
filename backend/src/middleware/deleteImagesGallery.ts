import { RequestHandler } from "express";
import { promises as fs } from "fs";
import path from "path";
import config from "../../config";
import { Model } from "mongoose";

type Mode = "delete" | "replace";

export function deleteOrReplaceGalleryImage<T>(
    model: Model<T>,
    mode: Mode = "delete"
): RequestHandler {
    return async (req, _res, next) => {
        try {
            const id = req.params.galleryId || req.params.id;
            if (!id) return next();

            let doc = await model.findById(id);
            if (!doc && req.params.galleryId) {
                doc = await model.findOne({ "gallery._id": id });
            }
            if (!doc) return next();

            const galleryItem = (doc as any).gallery?.find((item: any) => item._id.toString() === id);
            if (!galleryItem) return next();

            let toDelete: string[] = [];

            if (mode === "delete") {
                toDelete = [galleryItem.image];
            } else if (mode === "replace") {
                const file = (req.files as { [fieldname: string]: Express.Multer.File[] })?.gallery?.[0];
                if (file) {
                    toDelete = [galleryItem.image];
                }
            }

            await Promise.all(
                toDelete.map(async (imagePath) => {
                    const fullPath = path.join(config.publicPath, imagePath);
                    try {
                        await fs.unlink(fullPath);
                    } catch (err: any) {
                        if (err.code !== "ENOENT") {
                            console.error("Ошибка при удалении файла:", fullPath, err);
                        }
                    }
                })
            );

            next();
        } catch (err) {
            next(err);
        }
    };
}