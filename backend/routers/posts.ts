import express from 'express';
import Post from "../models/Post";

const postRouter = express.Router();

postRouter.get('/', async (_req, res, next) => {
    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (e) {
        next(e);
    }
});

postRouter.get('/:id', async (req, res, next) => {
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
});

export default postRouter;
