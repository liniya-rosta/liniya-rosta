import express from 'express';
import Category from "../models/Category";

const categoryRouter = express.Router();

categoryRouter.get('/', async (_req, res, next) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (e) {
        next(e);
    }
});

export default categoryRouter;

