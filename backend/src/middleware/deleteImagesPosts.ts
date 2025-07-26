import {RequestHandler} from "express";
import {Model, Types} from "mongoose";
import {promises as fs} from "fs";
import path from "path";
import config from "../../config";

interface Options {
    path: string;
    key?: string;
    mode?: "delete" | "replace" | "append";
}

export function deleteOrReplacePostImage<T>(
    model: Model<T>,
    {path: fieldPath, key = "image", mode = "delete"}: Options
): RequestHandler {
    return async (req, _res, next) => {
        try {
            const id = req.params.id;
            const imageUrl = req.body.imageUrl || req.body.image;

            if (!id || !Types.ObjectId.isValid(id) || typeof imageUrl !== "string") {
                return next();
            }

            const post = await model.findById(id).lean();
            if (!post) {
                return next();
            }

            const images = (post as Record<string, unknown>)[fieldPath];
            if (!Array.isArray(images)) {
                return next();
            }

            const targets = images.filter(
                (img): img is Record<string, string> =>
                    typeof img === "object" &&
                    img !== null &&
                    typeof img[key] === "string" &&
                    img[key] === imageUrl
            );

            if (!targets.length) {
                return next();
            }

            const hasNewFile = !!(req.file?.filename || (req.files && Object.keys(req.files).length));

            if (mode === "delete" || (mode === "replace" && hasNewFile)) {
                await Promise.all(
                    targets.map(async (t) => {
                        const fullPath = path.join(config.publicPath, t[key]);
                        try {
                            await fs.unlink(fullPath);
                        } catch (e) {
                            if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
                                console.error("Failed to delete file:", fullPath, e);
                            } else {
                                console.log("File not found, skipping deletion:", fullPath);
                            }
                        }
                    })
                );
            } else {
                console.log(`Skipping deletion because mode=${mode} and hasNewFile=${hasNewFile}`);
            }

            next();
        } catch (err) {
            next(err);
        }
    };


}
