import express from "express";
import Post from "../../models/Post";
import mongoose from "mongoose";
import {postImage} from "../../middleware/multer";
import {updatePost} from "../../../types";
import slugify from "slugify";
import {translateYandex} from "../../../translateYandex";

const postsSuperAdminRouter = express.Router();

postsSuperAdminRouter.post("/", postImage.array("images"), async (req, res, next) => {
    try {
        const {title, description, seoTitle, seoDescription} = req.body;
        const files = req.files as Express.Multer.File[];

        if (!title || !description || !title.trim() || !description.trim()) {
            res.status(400).send({error: "Поля заголовка и описания обязательны для заполнения"});
            return;
        }

        if (!files || files.length === 0) {
            res.status(400).send({error: "Добавьте хотя бы одно изображение"});
            return;
        }

        const alts: string[] = Array.isArray(req.body.alts) ? req.body.alts : [req.body.alts];

        const altsKy = await Promise.all(alts.map(alt => translateYandex(alt, "ky")));

        const images = files.map((file, index) => ({
            image: `post/${file.filename}`,
            alt: {
                ru: alts[index],
                ky: altsKy[index]
            },
        }));

        const kyTitle = await translateYandex(title, 'ky');
        const kyDes = await translateYandex(description, 'ky');

        const post = new Post({
            title: {ru: title, ky: kyTitle},
            description: {ru: description, ky: kyDes},
            seoTitle: seoTitle || null,
            seoDescription: seoDescription || null,
            images,
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

postsSuperAdminRouter.patch("/:id", postImage.array("images"), async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, description, seoTitle, seoDescription, mode = "replace"} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID поста"});
            return;
        }

        const post = await Post.findById(id);
        if (!post) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }

        const files = req.files as Express.Multer.File[];
        const alts: string[] = Array.isArray(req.body.alts) ? req.body.alts : [req.body.alts];

        if (!title?.trim() && !description?.trim() && (!files || files.length === 0) && (!req.body.alts || req.body.alts.length === 0)) {
            res.status(400).send({error: "Не указано ни одно поле для обновления"});
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

        const updateData: updatePost = {};
        if (title.trim()) {
            const kyTitle = await translateYandex(title, 'ky');
            updateData.title = {
                ru: title,
                ky: kyTitle
            };

            const baseSlug = slugify(title, {lower: true, strict: true});
            let uniqueSlug = baseSlug;
            let counter = 1;

            while (await Post.exists({slug: uniqueSlug, _id: {$ne: post._id}})) {
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            }

            updateData.slug = uniqueSlug;
        }

        const kyDes = await translateYandex(title, 'ky');

        if (description?.trim()) updateData.description = {
            ru: description,
            ky: kyDes
        };

        if (seoTitle !== undefined) {
            updateData.seoTitle = seoTitle?.trim() || null;
        }
        if (seoDescription !== undefined) {
            updateData.seoDescription = seoDescription?.trim() || null;
        }

        const altsKy = await Promise.all(alts.map(alt => translateYandex(alt, "ky")));

        if (files && files.length > 0) {
            const newImages = files.map((file, index) => ({
                image: `post/${file.filename}`,
                alt: {
                    ru: alts[index],
                    ky: altsKy[index],
                },
            }));

            if (mode === "append") {
                updateData.images = [...post.images, ...newImages];
            } else {
                updateData.images = newImages;
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        });

        if (!updatedPost) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }

        res.send({message: "Пост обновлен успешно", post: updatedPost});
    } catch (e) {
        next(e);
    }
});

postsSuperAdminRouter.patch("/:id/update-image", postImage.single("newImage"), async (req, res, next) => {
    const {id} = req.params;
    const {imageUrl, alt} = req.body;

    if (!imageUrl) {
        res.status(400).json({error: "Ссылка на изображение обязательна"});
        return;
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }

        const imageItem = post.images.find(img => img.image === imageUrl);
        if (!imageItem) {
            res.status(404).json({error: "Изображение не найдено"});
            return;
        }

        if (req.file) {
            imageItem.image = `post/${req.file.filename}`;
        }

        if (alt !== undefined) imageItem.alt = alt;

        await post.save();

        res.send({message: "Изображение обновлено", post});
    } catch (e) {
        next(e);
    }
});

postsSuperAdminRouter.patch("/:id/reorder-images", async (req, res, next) => {
    const {id} = req.params;
    const {newOrder} = req.body;

    if (!Array.isArray(newOrder) || newOrder.length === 0) {
        res.status(400).json({error: "Неверный формат нового порядка изображений"});
        return;
    }

    try {
        const post = await Post.findById(id);
        if (!post) {
            res.status(404).json({error: "Пост не найден"})
            return
        }

        const currentImages = post.images.map(img => img.image);
        const isValid =
            newOrder.length === currentImages.length &&
            newOrder.every(img => currentImages.includes(img.image));

        if (!isValid) {
            res.status(400).json({error: "Новый порядок содержит недопустимые изображения"});
            return
        }

        post.set("images", newOrder);
        await post.save();
        res.send(post);
    } catch (e) {
        next(e);
    }

});

postsSuperAdminRouter.patch("/:id/remove-images", async (req, res, next) => {
    const {id} = req.params;
    const {image} = req.body;

    if (!image) {
        res.status(400).json({error: "Не передан URL изображения"});
        return;
    }

    try {
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {$pull: {images: {image: image}}},
            {new: true}
        );

        if (!updatedPost) {
            res.status(404).send({error: "Пост не найден"});
            return;
        }

        res.send(updatedPost);
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