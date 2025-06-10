import Category from "../models/Category";
import { Request, Response, NextFunction } from 'express';

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await Category.find();
        res.send(categories);
    } catch (e) {
        next(e);
    }
}

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
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
}