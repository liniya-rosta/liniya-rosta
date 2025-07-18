import Product from "../models/Product";
import {NextFunction, Request, Response} from "express";
import mongoose, {PipelineStage} from "mongoose";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, category, imagesId, limit = 10, page = 1, description} = req.query;

        if (imagesId) {
            const item = await Product.findOne(
                {"images._id": imagesId},
                {"images.$": 1}
            );

            if (!item || !item.images || item.images.length === 0) {
                res.status(404).send({message: "Фото не найдено"});
                return;
            }

            res.send(item.images[0]);
            return;
        }

        const parsedLimit = Math.max(1, parseInt(limit as string));
        const parsedPage = Math.max(1, parseInt(page as string));
        const skip = (parsedPage - 1) * parsedLimit;

        const matchStage: Record<string, any> = {};

        if (title && typeof req.query.title === "string") {
            matchStage.title = {$regex: req.query.title, $options: "i"};
        }

        if (category && typeof category === "string") {
            matchStage["category"] = new mongoose.Types.ObjectId(category);
        }

        if (description && typeof description === "string") {
            matchStage.description = {$regex: description, $options: "i"};
        }

        const aggregationPipeline = [
            Object.keys(matchStage).length > 0 ? {$match: matchStage} : null,
            {$sort: {_id: -1}},
            {$skip: skip},
            {$limit: parsedLimit},
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    title: 1,
                    slug: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    category: 1,
                    cover: 1,
                    description: 1,
                    images: 1,
                    icon: 1,
                    sale: 1,
                    characteristics: 1,
                    imagesCount: {
                        $cond: {
                            if: {$isArray: "$images"},
                            then: {$size: "$images"},
                            else: 0
                        }
                    }
                }
            }
        ].filter(Boolean) as PipelineStage[];

        const [items, totalCount] = await Promise.all([
            Product.aggregate(aggregationPipeline),
            Product.countDocuments(matchStage)
        ]);

        res.send({
            items,
            total: totalCount,
            page: parsedPage,
            pageSize: parsedLimit,
            totalPages: Math.ceil(totalCount / parsedLimit),
        });
    } catch (e) {
        next(e);
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id).populate("category", "title");
        if (!product) {
            res.status(404).send({message: 'Продукт не найден'});
            return;
        }

        res.send(product);
    } catch (e) {
        next(e);
    }
}