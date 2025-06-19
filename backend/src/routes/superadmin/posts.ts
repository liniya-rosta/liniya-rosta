import express from 'express';
import Post from "../../models/Post";
import mongoose from "mongoose";
import {postImage} from "../../middleware/multer";

const postsSuperAdminRouter = express.Router();

postsSuperAdminRouter.post("/", postImage.single("image"), async (req, res, next) => {
    try {
        const {title, description} = req.body;
        if (!title || !description || !title.trim() || !description.trim() || !req.file) {
            res.status(400).send({error: "Все поля обязательны для заполнения"});
            return;
        }

        const post = new Post({
            title: title.trim(),
            description: description.trim(),
            image: `post/${req.file.filename}`,
        });

        await post.save();
        res.send({
            message: "Пост создан успешно",
            post,
        });
    } catch (e) {
        next(e);
    }
});

postsSuperAdminRouter.patch("/:id", postImage.single("image"), async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID поста"});
            return;
        }

        if (!title && !description && !req.file) {
            res.status(400).send({error: "Не указаны поля для обновления"});
            return;
        }

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }

        if (title && !title.trim()) {
            res.status(400).send({error: "Заголовок не может быть пустым"});
            return;
        }
        if (description && !description.trim()) {
            res.status(400).send({error: "Описание не может быть пустым"});
            return;
        }

        if (title) post.title = title.trim();
        if (description) post.description = description.trim();
        if (req.file) post.image = `post/${req.file.filename}`;

        await post.save();
        res.send({message: "Пост обновлен успешно", post});
    } catch (e) {
        next(e);
    }
});

postsSuperAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).send({error: "Неверный формат ID поста"});
            return;
        }

        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }
        res.send({message: "Пост успешно удален"});
    } catch (e) {
        next(e);
    }
});

export default postsSuperAdminRouter;