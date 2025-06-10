import {PortfolioItem} from "../models/PortfolioItem";
import { Request, Response, NextFunction } from "express";

export const getPortfolioItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { galleryId } = req.query;

        if (galleryId) {
            const item = await PortfolioItem.findOne(
                { "gallery._id": galleryId },
                { "gallery.$": 1 }
            );

            if (!item || !item.gallery || item.gallery.length === 0) {
                res.status(404).send({ message: "Элемент галереи не найден" });
                return;
            }

            res.send(item.gallery[0]);
            return;
        }

        const items = await PortfolioItem.find().select("-gallery");
        res.send(items);
    } catch (err) {
        next(err);
    }
}

export const getPortfolioItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;
        const items = await PortfolioItem.findById(id);
        res.send(items);
    } catch (err) {
        next(err);
    }
}