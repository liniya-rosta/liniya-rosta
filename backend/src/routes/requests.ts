import express from "express";
import {postRequest} from "../controllers/requests";

const requestRouter = express.Router();

requestRouter.post('/', postRequest);

export default requestRouter