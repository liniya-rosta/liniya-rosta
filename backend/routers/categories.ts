import express from 'express';
import Category from "../models/Category";

const categoriesRouter = express.Router();

categoriesRouter.get('/', async (_req, res, next) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (e) {
        next(e);
    }
});

categoriesRouter.get("/:id", async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            res.status(404).send({error: "Категория не найдена"});
            return;
        }
        res.send(category);
    } catch (e) {
        next(e);
    }
});

export default categoriesRouter;

