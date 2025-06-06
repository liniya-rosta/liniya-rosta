import express from "express";
import permit from "../../middleware/permit";
import {authAdmin} from "../../middleware/authAdmin";


const superAdminRouter = express.Router();

superAdminRouter.use(authAdmin, permit('superadmin'));

// superAdminRouter.use('/users', usersAdminRouter);

export default superAdminRouter;