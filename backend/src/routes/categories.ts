import express from 'express';
import Category from "../models/Category";
import {getCategories, getCategoryById} from "../controllers/categories";

const categoriesRouter = express.Router();

categoriesRouter.get('/', getCategories);
categoriesRouter.get("/:id", getCategoryById);

export default categoriesRouter;

