import Product from "../models/Product";
import {NextFunction, Request, Response} from "express";
import mongoose, {FilterQuery, PipelineStage} from "mongoose";
import {IProduct} from "../../types";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, category, imagesId, limit = 10, page = 1, description, categoryExclude} = req.query;

        await Product.updateMany(
            { "sale.isOnSale": true, "sale.saleDate": { $lte: new Date() } },
            { $set: { "sale.isOnSale": false, "sale.saleDate": null } }
        );

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

        const conditions: FilterQuery<IProduct>[] = [];

        if (title && typeof title === "string") {
            conditions.push({ "title.ru": { $regex: title, $options: "i" } });
        }

        if (description && typeof description === "string") {
            conditions.push({ "description.ru": { $regex: description, $options: "i" } });
        }

        if (category && typeof category === "string") {
            conditions.push({ category: new mongoose.Types.ObjectId(category) });
        }

        if (categoryExclude && typeof categoryExclude === "string") {
            conditions.push({ category: { $ne: new mongoose.Types.ObjectId(categoryExclude) } });
        }

        const matchStage: FilterQuery<IProduct> = {};

        if (conditions.length > 0) {
            matchStage["$and"] = conditions;
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
                    seoTitle: 1,
                    seoDescription: 1,
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

export const getProductBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const slug = req.params.slug;

    try {
        const product = await Product.findOne({slug}).populate("category", "title");
        if (!product) {
            res.status(404).send({message: 'Продукт не найден'});
            return;
        }

        res.send(product);
    } catch (e) {
        next(e);
    }
}