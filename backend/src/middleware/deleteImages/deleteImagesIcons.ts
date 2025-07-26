import {RequestHandler} from "express";
import {Model, Types} from "mongoose";
import {promises as fs} from "fs";
import path from "path";
import config from "../../../config";

interface Options {
    path: string;
    key?: string;
    mode?: "delete" | "replace";
}

export function deleteOrReplaceIconImage<
    DocType extends Document = Document
>(
    model: Model<DocType>,
    {path: fieldPath, key = "url", mode = "delete"}: Options
): RequestHandler {
    return async (req, _res, next) => {
        try {
            const id = req.params.id;
            if (!id || !Types.ObjectId.isValid(id)) return next();

            const doc = await model.findById(id).lean();
            if (!doc) return next();


            const field = doc[fieldPath as keyof typeof doc];
            if (
                typeof field !== "object" ||
                field === null ||
                !(key in field) ||
                typeof (field as Record<string, unknown>)[key] !== "string"
            ) {
                return next();
            }

            const filePath = (field as Record<string, string>)[key];
            const iconFiles = (req.files as Record<string, Express.Multer.File[]>)?.icon;
            const hasNewFile = !!(req.file?.filename || (iconFiles && iconFiles.length > 0));


            if (mode === "delete" || (mode === "replace" && hasNewFile)) {
                const fullPath = path.join(config.publicPath, filePath);
                try {
                    await fs.unlink(fullPath);
                } catch (e) {
                    if ((e as NodeJS.ErrnoException).code !== "ENOENT") {
                        console.error("Failed to delete icon:", fullPath, e);
                    } else {
                        console.log("Icon file not found, skipping:", fullPath);
                    }
                }
            }

            next();
        } catch (err) {
            next(err);
        }
    };
}
