import express from "express";
import User from "../modules/User";
import {authAdmin, RequestWithUser} from "../middleware/authAdmin";

const usersRouter = express.Router();

usersRouter.post('/refresh-token', authAdmin, async (req: RequestWithUser, res) => {
    const user = await User.findById(req.user!._id);
    if (!user) {
         res.status(404).send({ error: 'User not found' });
        return
    }
    const newAccessToken = user.generateAccessToken();
    res.send({ accessToken: newAccessToken });
});

export default usersRouter;




