import express from "express";
import RequestFromClient from "../models/Request";
import {getRequests} from "../controllers/requests";

const requestRouter = express.Router();

requestRouter.post('/', getRequests);

export default requestRouter