import express from "express";
import {getServiceByID, getServices} from "../controllers/services";

const serviceRouter = express.Router();

serviceRouter.get("/", getServices);
serviceRouter.get("/:id", getServiceByID);

export default serviceRouter;