import express from 'express';
import Post from "../../models/Post";

const postsAdminRouter = express.Router();

postsAdminRouter.post("/", async (req, res, next) => {
    try {
        const {title, description, image} = req.body;
        if (!title || !description || !image) {
            res.status(400).send({error: "Все поля обязательны для заполнения"});
            return;
        }

        const post = new Post({title, description, image});
        await post.save();
        res.send({message: "Пост создан успешно", post});
    } catch (e) {
        next(e);
    }
});

postsAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, description, image} = req.body;

        if (!title && !description && !image) {
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
        if (image && !image.trim()) {
            res.status(400).send({error: "Изображение не может быть пустым"});
            return;
        }

        if (title) post.title = title;
        if (description) post.description = description;
        if (image) post.image = image;

        await post.save();
        res.send({message: "Пост обновлен успешно", post});
    } catch (e) {
        next(e);
    }
});

postsAdminRouter.delete("/:id", async (req, res, next) => {
    try {
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

export default postsAdminRouter;