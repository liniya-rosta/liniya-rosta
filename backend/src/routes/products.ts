import express from 'express';
import Product from "../models/Product";
import {getProductById, getProducts} from "../controllers/products";

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProductById);

export default productsRouter;