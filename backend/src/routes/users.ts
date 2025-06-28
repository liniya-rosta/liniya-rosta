import express from "express";
import {editProfile, login, logout, refreshToken} from "../controllers/users";
import {authAdmin} from "../middleware/authAdmin";

const usersRouter = express.Router();

usersRouter.post("/sessions", login);
usersRouter.delete("/logout", logout);
usersRouter.post("/refresh-token", refreshToken);
usersRouter.patch('/profile', authAdmin, editProfile);
export default usersRouter;
