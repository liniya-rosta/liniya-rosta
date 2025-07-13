import express from "express";
import Post from "../../models/Post";
import mongoose from "mongoose";
import { postImage } from "../../middleware/multer";
import { deleteOrReplaceImages } from "../../middleware/deleteImages";

const postsSuperAdminRouter = express.Router();

postsSuperAdminRouter.post("/", postImage.single("image"), async (req, res, next) => {
    try {
        const { title, description } = req.body;
        if (!title || !description || !title.trim() || !description.trim() || !req.file) {
            res.status(400).send({ error: "Все поля обязательны для заполнения" });
            return;
        }

        const post = new Post({
            title: title.trim(),
            description: description.trim(),
            image: `posts/${req.file.filename}`,
        });

        await post.save();
        res.send({ message: "Пост создан успешно", post });
    } catch (e) {
        next(e);
    }
});

postsSuperAdminRouter.patch(
    "/:id",
    postImage.single("image"),

    deleteOrReplaceImages(
        Post,
        doc => [doc.image],
        req => req.file ? [`posts/${req.file.filename}`] : [],
        "replace"
    ),

    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { title, description } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID поста" });
                return;
            }

            const post = await Post.findById(id);
            if (!post) {
                res.status(404).send({ error: "Пост не найден" });
                return;
            }

            if (title !== undefined) post.title = title.trim();
            if (description !== undefined) post.description = description.trim();
            if (req.file) post.image = `posts/${req.file.filename}`;

            await post.save();
            res.send({ message: "Пост обновлен успешно", post });
        } catch (e) {
            next(e);
        }
    }
);

postsSuperAdminRouter.delete(
    "/:id",
    deleteOrReplaceImages(Post, doc => [doc.image]),
    async (req, res, next) => {
        try {
            const post = await Post.findByIdAndDelete(req.params.id);
            if (!post) {
                res.status(404).send({ error: "Пост не найден" });
                return;
            }
            res.send({ message: "Пост успешно удален" });
        } catch (e) {
            next(e);
        }
    }
);

export default postsSuperAdminRouter;