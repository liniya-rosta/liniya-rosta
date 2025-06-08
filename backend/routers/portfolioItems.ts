import express from "express";
import {PortfolioItem} from "../models/PortfolioItem";

const portfolioItemRouter = express.Router();

portfolioItemRouter.get("/", async (req, res, next) => {
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
});

portfolioItemRouter.get("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const items = await PortfolioItem.findById(id);
        res.send(items);
    } catch (err) {
        next(err);
    }
});

export default portfolioItemRouter;