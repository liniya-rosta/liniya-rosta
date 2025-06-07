import express from 'express';
import Category from "../../models/Category";
import Product from "../../models/Product";
import mongoose from "mongoose";

const categoriesAdminRouter = express.Router();

categoriesAdminRouter.post("/", async (req, res, next) => {
    try {
        const {title} = req.body;
        if (!title) {
            res.status(400).send({error: "Заголовок обязателен"});
            return;
        }

        const existing = await Category.findOne({title});
        if (existing) {
            res.status(400).send({error: "Категория с таким названием уже существует"});
            return;
        }

        const category = new Category({title});
        await category.save();
        res.send({message: "Категория создана успешно", category});
    } catch (e) {
        next(e);
    }
});

categoriesAdminRouter.patch("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title} = req.body;
        if (!title || !title.trim()) {
            res.status(400).send({error: "Заголовок обязателен"});
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID категории"});
            return;
        }

        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({error: "Категория не найдена"});
            return;
        }

        if (category.title === title) {
            res.send({
                message: "Название категории не изменилось",
                category
            });
            return;
        }

        const existing = await Category.findOne({title});
        if (existing) {
            res.status(400).send({
                error: "Категория с таким названием уже существует"
            });
            return;
        }

        category.title = title.trim();
        await category.save();
        res.send({message: "Категория обновлена успешно", category});
    } catch (e) {
        next(e);
    }
});

categoriesAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).send({error: "Неверный формат ID категории"});
            return;
        }

        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).send({error: "Категория не найдена"});
            return;
        }

        await Product.deleteMany({category: req.params.id});
        res.send({message: "Категория и связанные с ней продукты успешно удалены"});
    } catch (e) {
        next(e);
    }
});

export default categoriesAdminRouter;

