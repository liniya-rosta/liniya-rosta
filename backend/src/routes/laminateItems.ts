import express from 'express';
import {getLaminateItemById, getLaminateItems} from "../controllers/laminateItems";

const laminateItemsRouter = express.Router();

laminateItemsRouter.get('/', getLaminateItems);
laminateItemsRouter.get('/:id', getLaminateItemById);

export default laminateItemsRouter;