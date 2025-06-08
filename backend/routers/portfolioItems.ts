import express from "express";
import {PortfolioItem} from "../models/PortfolioItem";

const portfolioItemRouter = express.Router();

portfolioItemRouter.get("/", async (req, res, next) => {
    try {
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

portfolioItemRouter.get("/gallery/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const item = await PortfolioItem.findOne(
            { "gallery._id": id },
            { "gallery.$": 1 }
        );

        if (!item || !item.gallery || item.gallery.length === 0) {
            res.status(404).send({ message: "Элемент галереи не найден" });
            return;
        }

        res.send(item.gallery[0]);
    } catch (e) {
        next(e);
    }
});

export default portfolioItemRouter;