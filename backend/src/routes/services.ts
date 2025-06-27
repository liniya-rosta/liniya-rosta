import express from "express";
import {getServices} from "../controllers/services";

const serviceRouter = express.Router();

serviceRouter.get('/', getServices);

export default serviceRouter;