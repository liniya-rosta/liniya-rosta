import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";

const productsAdminRouter = express.Router();

productsAdminRouter.post("/", async (req, res, next) => {
    try {
        const {category, title, description, image} = req.body;
        if (!category || !title || !image) {
            res.status(400).send({error: "Категория, заголовок и изображение обязательны"});
            return;
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400).send({error: "Указанная категория не существует"});
            return;
        }

        const product = new Product({
            category,
            title,
            description: description || null,
            image: image,
        });

        await product.save();
        res.send({message: "Продукт создан успешно", product});
    } catch (e) {
        next(e);
    }
});

productsAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const {category, title, description, image} = req.body;

        if (!category && !title && !description && !image) {
            res.status(400).send({error: "Не указаны поля для обновления"});
            return;
        }

        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }

        if (category) {
            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(400).send({error: "Указанная категория не существует"});
                return;
            }
        }

        if (title && !title.trim()) {
            res.status(400).send({error: "Заголовок не может быть пустым"});
            return;
        }

        if (description !== undefined && description !== null && !description.trim()) {
            res.status(400).send({error: "Описание не может быть пустым"});
            return;
        }

        if (image && !image.trim()) {
            res.status(400).send({error: "Изображение не может быть пустым"});
            return;
        }

        if (category) product.category = category;
        if (title) product.title = title.trim();
        if (description !== undefined) product.description = description;
        if (image) product.image = image.trim();

        await product.save();
        res.send({message: "Продукт обновлен успешно", product});
    } catch (e) {
        next(e);
    }
});

productsAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }
        res.send({message: "Продукт успешно удален"});
    } catch (e) {
        next(e);
    }
});

export default productsAdminRouter;