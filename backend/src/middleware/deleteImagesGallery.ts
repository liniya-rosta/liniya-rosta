import {DocumentWithGallery, FileRequestFiles, IGalleryItem} from "../../types";
import {RequestHandler} from "express";
import {Model} from "mongoose";
import {Mode} from "node:fs";
import path from "path";
import config from "../../config";
import { promises as fs } from "fs";

export function deleteOrReplaceGalleryImage<T extends DocumentWithGallery>(
    model: Model<T>,
    mode: Mode = "delete"
): RequestHandler {
    return async (req, _res, next) => {
        try {
            const id = req.params.id || req.params.galleryId;
            if (!id) return next();

            const doc = await model.findOne({ "gallery._id": id });
            if (!doc) return next();

            const galleryItem = doc.gallery.find(
                (item: IGalleryItem) => item._id.toString() === id
            );
            if (!galleryItem) return next();

            let toDelete: string[] = [];

            if (mode === "delete") {
                toDelete = [galleryItem.image];
            } else if (mode === "replace") {
                const files = req.files as FileRequestFiles;
                const file = files?.gallery?.[0];
                if (file) {
                    toDelete = [galleryItem.image];
                }
            }

            await Promise.all(
                toDelete.map(async (imagePath: string) => {
                    const fullPath = path.join(config.publicPath, imagePath);
                    try {
                        await fs.unlink(fullPath);
                    } catch (err) {
                        const error = err as NodeJS.ErrnoException;
                        if (error.code !== "ENOENT") {
                            console.error("Ошибка при удалении файла:", fullPath, error);
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
