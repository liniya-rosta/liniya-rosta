import express from "express";
import {login, logout, refreshToken} from "../controllers/users";

const usersRouter = express.Router();

usersRouter.post("/sessions", login);
usersRouter.delete("/logout", logout);
usersRouter.post("/refresh-token", refreshToken);

export default usersRouter;
