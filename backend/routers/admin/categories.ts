import express from 'express';
import Category from "../../models/Category";

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
        if (!title) {
            res.status(400).send({error: "Заголовок обязателен"});
            return;
        }

        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({error: "Категория не найдена"});
            return;
        }

        const existing = await Category.findOne({title});
        if (existing && existing._id.toString() !== id) {
            res.status(400).send({error: "Категория с таким названием уже существует"});
            return;
        }

        category.title = title;
        await category.save();
        res.send({message: "Категория обновлена успешно", category});
    } catch (e) {
        next(e);
    }
});

categoriesAdminRouter.delete("/:id", async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            res.status(404).send({error: "Категория не найдена"});
            return;
        }
        res.send({message: "Категория успешно удалена"});
    } catch (e) {
        next(e);
    }
});

export default categoriesAdminRouter;

