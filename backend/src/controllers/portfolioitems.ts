import {PortfolioItem} from "../models/PortfolioItem";
import {Request, Response, NextFunction} from "express";
import mongoose, {isValidObjectId, PipelineStage} from "mongoose";

export const getPortfolioItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {galleryId, limit = 10, page = 1, description, coverAlt} = req.query;

        if (galleryId) {
            const item = await PortfolioItem.findOne(
                {"gallery._id": galleryId},
                {"gallery.$": 1}
            );

            if (!item || !item.gallery || item.gallery.length === 0) {
                res.status(404).send({message: "Элемент галереи не найден"});
                return;
            }

            res.send(item.gallery[0]);
            return;
        }

        const parsedLimit = Math.max(1, parseInt(limit as string));
        const parsedPage = Math.max(1, parseInt(page as string));
        const skip = (parsedPage - 1) * parsedLimit;

        const matchStage: Partial<{
            description: {$regex: string; $options: string};
            coverAlt: {$regex: string; $options: string};
        }> = {};

        if (description && typeof description === "string") {
            matchStage.description = {$regex: description, $options: "i"};
        }

        if (coverAlt && typeof coverAlt === "string") {
            matchStage.coverAlt = {$regex: coverAlt, $options: "i"};
        }

        const aggregationPipeline = [
            Object.keys(matchStage).length > 0 ? {$match: matchStage} : null,
            {$sort: {_id: -1}},
            {$skip: skip},
            {$limit: parsedLimit},
            {
                $project: {
                    cover: 1,
                    coverAlt: 1,
                    description: 1,
                    slug: 1,
                    seoTitle: 1,
                    seoDescription: 1,
                    galleryCount: {$size: "$gallery"},
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ].filter(Boolean) as PipelineStage[];

        const [items, totalCount] = await Promise.all([
            PortfolioItem.aggregate(aggregationPipeline),
            PortfolioItem.countDocuments(matchStage)
        ]);

        res.send({
            items,
            total: totalCount,
            page: parsedPage,
            pageSize: parsedLimit,
            totalPages: Math.ceil(totalCount / parsedLimit),
        });
    } catch (err) {
        next(err);
    }
}

export const getPortfolioItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({error: "Не валидный ID формат"});
            return
        }
        const items = await PortfolioItem.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {
                $project: {
                    cover: 1,
                    coverAlt: 1,
                    description: 1,
                    slug: 1,
                    seoTitle: 1,
                    seoDescription: 1,
                    gallery: 1,
                    galleryCount: {$size: "$gallery"},
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]);

        if (!items || items.length === 0) {
            res.status(404).send({message: "Портфолио не найдено"});
            return;
        }

        res.send(items[0]);
    } catch (err) {
        next(err);
    }
}

export const getPortfolioItemBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {slug} = req.params;

        const item = await PortfolioItem.findOne({slug});

        if (!item) {
            res.status(404).send({message: "Портфолио не найдено"});
            return;
        }

        res.json(item);
    } catch (err) {
        next(err);
    }
};