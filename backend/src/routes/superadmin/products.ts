import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";
import mongoose from "mongoose";
import { productImage } from "../../middleware/multer";
import { deleteOrReplaceImages } from "../../middleware/deleteImages";

const productsSuperAdminRouter = express.Router();

productsSuperAdminRouter.post("/", productImage.single("image"), async (req, res, next) => {
    try {
        const { category, title, description } = req.body;
        if (!category || !title || !title.trim() || !req.file) {
            res.status(400).send({ error: "Категория, заголовок и изображение обязательны" });
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).send({ error: "Неверный формат ID категории" });
            return;
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400).send({ error: "Указанная категория не существует" });
            return;
        }

        const product = new Product({
            category,
            title: title.trim(),
            description: description ? description.trim() : null,
            image: `products/${req.file.filename}`,
        });

        await product.save();
        res.send({ message: "Продукт создан успешно", product });
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.patch(
    "/:id",
    productImage.single("image"),
    deleteOrReplaceImages(
        Product,
        doc => [doc.image],
        req => req.file ? [`products/${req.file.filename}`] : [],
        "replace"
    ),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const { category, title, description } = req.body;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).send({ error: "Неверный формат ID продукта" });
                return;
            }

            if (!category && !title && !description && !req.file) {
                res.status(400).send({ error: "Не указаны поля для обновления" });
                return;
            }

            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send({ error: "Продукт не найден" });
                return;
            }

            if (category) {
                if (!mongoose.Types.ObjectId.isValid(category)) {
                    res.status(400).send({ error: "Неверный формат ID категории" });
                    return;
                }

                const categoryExists = await Category.findById(category);
                if (!categoryExists) {
                    res.status(400).send({ error: "Указанная категория не существует" });
                    return;
                }
            }

            if (title && !title.trim()) {
                res.status(400).send({ error: "Заголовок не может быть пустым" });
                return;
            }

            if (description?.trim() === '') {
                res.status(400).send({ error: "Описание не может быть пустым" });
                return;
            }

            if (category) product.category = category;
            if (title) product.title = title.trim();
            if (description !== undefined) product.description = description;
            if (req.file) product.image = `products/${req.file.filename}`;

            await product.save();
            res.send({ message: "Продукт обновлен успешно", product });
        } catch (e) {
            next(e);
        }
    }
);

productsSuperAdminRouter.delete(
    "/:id",
    deleteOrReplaceImages(Product, (doc) => [doc.image]),
    async (req, res, next) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if (!product) {
                res.status(404).send({ error: "Продукт не найден" });
                return;
            }
            res.send({ message: "Продукт успешно удален" });
        } catch (e) {
            next(e);
        }
    }
);

export default productsSuperAdminRouter;
