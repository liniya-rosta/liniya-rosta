import Category from "../models/Category";
import {Request, Response, NextFunction} from 'express';

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const slug = req.query.slug as string;
        const filter: { slug?: string } = {};

        if (slug) filter.slug = slug;

        const categories = await Category.find(filter);

        if (slug && categories.length === 0) {
            res.status(404).json({message: `Категория с slug "${slug}" не найдена`});
            return;
        }

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