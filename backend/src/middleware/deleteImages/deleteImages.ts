import { RequestHandler } from "express";
import { promises as fs } from "fs";
import path from "path";
import config from "../../../config";
import {DocumentWithImages, RequestWithFile} from "../../../types";
import {Model} from "mongoose";

type Mode = "delete" | "replace";

export const deleteOrReplaceImages = <T extends DocumentWithImages>(
    model: Model<T>,
    getImagePathsFromDoc: (doc: T) => string[],
    getImagePathsFromReq?: (req: RequestWithFile) => string[],
    mode: Mode = "delete"
): RequestHandler => {
    return async (req, _res, next) => {
        try {
            const doc = await model.findById(req.params.id);
            if (!doc) return next();

            const oldImages = getImagePathsFromDoc(doc);
            let toDelete: string[] = [];

            if (mode === "delete") {
                toDelete = oldImages;
            } else if (mode === "replace") {
                if (!getImagePathsFromReq) {
                    console.warn("getImagePathsFromReq is not provided in replace mode");
                    return next();
                }
                const newImages = getImagePathsFromReq(req);

                if (!newImages || newImages.length === 0) {
                    return next();
                }

                toDelete = oldImages.filter(oldPath => !newImages.includes(oldPath));
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
};