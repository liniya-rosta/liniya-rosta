import Post from "../models/Post";
import { Request, Response, NextFunction } from "express";

export const getPosts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const posts = await Post.find();
        res.send(posts);
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