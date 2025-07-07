import { RequestHandler } from "express";
import { promises as fs } from "fs";
import path from "path";
import config from "../../config";
import { Model } from "mongoose";

type Mode = "delete" | "replace";

export const deleteOrReplaceImages = (
    model: Model<any>,
    getImagePathsFromDoc: (doc: any) => string[],
    getImagePathsFromReq?: (req: any) => string[],
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
                toDelete = oldImages.filter(oldPath => !newImages.includes(oldPath));
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
};
