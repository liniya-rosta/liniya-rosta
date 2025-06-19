import {PortfolioItem} from "../models/PortfolioItem";
import {Request, Response, NextFunction} from "express";
import mongoose, {isValidObjectId} from "mongoose";

export const getPortfolioItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {galleryId} = req.query;

        if (galleryId) {
            const item = await PortfolioItem.findOne(
                {"gallery._id": galleryId},
                {"gallery.$": 1}
            );

            if (!item || !item.gallery || item.gallery.length === 0) {
                res.status(404).send({message: "Элемент галереи не найден"});
                return;
            }

            res.send(item.gallery[0]);
            return;
        }

        const items = await PortfolioItem.aggregate([
            {
                $project: {
                    cover: 1,
                    coverAlt: 1,
                    description: 1,
                    galleryCount: {$size: "$gallery"}
                }
            }
        ]);

        res.send(items);
    } catch (err) {
        next(err);
    }
}

export const getPortfolioItemById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({error: "Не валидный ID формат"});
            return
        }
        const items = await PortfolioItem.aggregate([
            {$match: {_id: new mongoose.Types.ObjectId(id)}},
            {
                $project: {
                    cover: 1,
                    coverAlt: 1,
                    description: 1,
                    gallery: 1,
                    galleryCount: {$size: "$gallery"}
                }
            }
        ]);

        if (!items || items.length === 0) {
            res.status(404).send({message: "Портфолио не найдено"});
            return;
        }

        res.send(items[0]);
    } catch (err) {
        next(err);
    }
}