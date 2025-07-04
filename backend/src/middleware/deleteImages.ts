import { RequestHandler } from "express";
import { promises as fs } from "fs";
import path from "path";
import config from "../../config";
import { Model } from "mongoose";

export const deleteImagesFromFs = (
    model: Model<any>,
    getImagePaths: (doc: any) => string[]
): RequestHandler => {
    return async (req, _res, next) => {
        try {
            const doc = await model.findById(req.params.id);
            if (doc) {
                const images = getImagePaths(doc);
                await Promise.all(
                    images.map(async (imagePath) => {
                        const fullPath = path.join(config.publicPath, imagePath);
                        try {
                            await fs.unlink(fullPath);
                            console.log("Файл удалён:", fullPath);
                        } catch (err: any) {
                            if (err.code !== "ENOENT") {
                                console.error("Ошибка при удалении файла:", fullPath, err);
                            }
                        }
                    })
                );
            }
            next();
        } catch (err) {
            next(err);
        }
    };
};
