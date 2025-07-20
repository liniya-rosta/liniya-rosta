import Post from "../models/Post";
import {Request, Response, NextFunction} from "express";
import {PipelineStage} from "mongoose";

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {title, limit = 10, page = 1, description} = req.query;

        const parsedLimit = Math.max(1, parseInt(limit as string));
        const parsedPage = Math.max(1, parseInt(page as string));
        const skip = (parsedPage - 1) * parsedLimit;

        const matchStage: Partial<{
            description: { $regex: string; $options: string };
            title: { $regex: string; $options: string };
        }> = {};

        if (description && typeof description === "string") {
            matchStage.description = {$regex: description, $options: "i"};
        }

        if (title && typeof title === "string") {
            matchStage.title = {$regex: title, $options: "i"};
        }
        const aggregationPipeline = [
            Object.keys(matchStage).length > 0 ? {$match: matchStage} : null,
            {$sort: {_id: -1}},
            {$skip: skip},
            {$limit: parsedLimit},
            {
                $project: {
                    title: 1,
                    slug: 1,
                    seoTitle: 1,
                    seoDescription: 1,
                    images: 1,
                    description: 1,
                    imageCount: {$size: "$images"}
                }
            }
        ].filter(Boolean) as PipelineStage[];

        const [items, totalCount] = await Promise.all([
            Post.aggregate(aggregationPipeline),
            Post.countDocuments(matchStage)
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

export const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const post = await Post.findById(id);

        if (!post) {
            res.status(404).send({message: 'Пост не найден'});
            return;
        }

        res.send(post);
    } catch (e) {
        next(e);
    }
}

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
    const {slug} = req.params;

    try {
        const post = await Post.findOne({slug});

        if (!post) {
            return res.status(404).send({message: "Пост не найден"});
        }

        res.send(post);
    } catch (e) {
        next(e);
    }
};