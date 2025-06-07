import express from "express";
import { authAdmin } from "../../middleware/authAdmin";
import {authSuperAdmin} from "../../middleware/authSuperAdmin";
import superAdminRouter from "./superadmin";
import categoriesAdminRouter from "./categories";
import productsAdminRouter from "./products";
import postsAdminRouter from "./posts";

const adminRouter = express.Router();

adminRouter.use(authAdmin);

adminRouter.use("/categories", categoriesAdminRouter);
adminRouter.use("/products", productsAdminRouter);
adminRouter.use("/posts", postsAdminRouter);
adminRouter.use("/super", authSuperAdmin, superAdminRouter);

export default adminRouter;
