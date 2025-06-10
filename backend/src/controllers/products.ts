import Product from "../models/Product";
import { Request, Response, NextFunction } from "express";

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category_id = req.query.category as string;
        const filter: { category?: string } = {};

        if (category_id) filter.category = category_id;

        const products = await Product.find(filter).populate("category", "title");
        res.send(products);
    } catch (e) {
        next(e);
    }
}

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    try {
        const product = await Product.findById(id);

        if (!product) {
            res.status(404).send({message: 'Продукт не найден'});
            return;
        }

        res.send(product);
    } catch (e) {
        next(e);
    }
}