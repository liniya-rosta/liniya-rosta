import express from "express";
import {getPortfolioItemById, getPortfolioItemBySlug, getPortfolioItems} from "../controllers/portfolioitems";

const portfolioItemRouter = express.Router();

portfolioItemRouter.get("/", getPortfolioItems);
portfolioItemRouter.get("/:id", getPortfolioItemById);
portfolioItemRouter.get("/slug/:slug", getPortfolioItemBySlug);

export default portfolioItemRouter;