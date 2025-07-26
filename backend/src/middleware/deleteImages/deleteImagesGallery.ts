import {RequestHandler} from "express";
import {Model, RootFilterQuery, Types} from "mongoose";
import {promises as fs} from "fs";
import path from "path";
import config from "../../../config";
import {FileRequestFiles} from "../../../types";

interface DeleteOrReplaceOptions {
    path: string;
    key?: string;
    mode?: "delete" | "replace";
}

export function deleteOrReplaceSubImage<T>(
    model: Model<T>,
    options: DeleteOrReplaceOptions
): RequestHandler {
    return async (req, _res, next) => {
        try {
            const {path: fieldPath, key = "image", mode = "delete"} = options;
            const id = req.params.imageId || req.params.id || req.params.galleryId;
            if (!id || !Types.ObjectId.isValid(id)) return next();

            const filter = {[`${fieldPath}._id`]: id};

            const doc = await model.findOne(filter as RootFilterQuery<T>).lean();

            if (!doc) return next();

            const items = (doc as Record<string, unknown>)[fieldPath];
            if (!Array.isArray(items)) return next();

            const targetItem = items.find((item) => {
                return typeof item === "object" &&
                    item &&
                    "_id" in item &&
                    (item._id as Types.ObjectId).toString() === id;
            }) as Record<string, string> | undefined;

            if (!targetItem || typeof targetItem[key] !== "string") return next();

            const toDelete: string[] = [];

            if (mode === "delete") {
                toDelete.push(targetItem[key]);
            } else if (mode === "replace") {
                const file = (req.file as Express.Multer.File) ||
                    (req.files as FileRequestFiles)?.[fieldPath]?.[0];
                if (file) {
                    toDelete.push(targetItem[key]);
                }
            }

            await Promise.all(
                toDelete.map(async (imagePath) => {
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
