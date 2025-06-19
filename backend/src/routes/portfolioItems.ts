import express from "express";
import {getPortfolioItemById, getPortfolioItems} from "../controllers/portfolioitems";

const portfolioItemRouter = express.Router();

portfolioItemRouter.get("/", getPortfolioItems);
portfolioItemRouter.get("/:id", getPortfolioItemById);

export default portfolioItemRouter;