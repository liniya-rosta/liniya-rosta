import express from 'express';
import {getProductById, getProductBySlug, getProducts} from "../controllers/products";

const productsRouter = express.Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProductById);
productsRouter.get('/slug/:slug', getProductBySlug);

export default productsRouter;