import multer from "multer";
import { promises as fs } from "fs";
import path from "path";
import config from "../../config";
import { randomUUID } from "node:crypto";

const createImageUpload = (folder: string) =>
    multer({
        storage: multer.diskStorage({
            destination: async (_req, _file, cb) => {
                const destDir = path.join(config.publicPath, folder);
                await fs.mkdir(destDir, { recursive: true });
                cb(null, destDir);
            },
            filename: (_req, file, cb) => {
                const extension = path.extname(file.originalname);
                cb(null, randomUUID() + extension);
            },
        }),
    });

export const productImage = createImageUpload("products");
export const postImage = createImageUpload("posts");
export const portfolioImage = createImageUpload("portfolio");
export const laminateImage = createImageUpload("laminate");
