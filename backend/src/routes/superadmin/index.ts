import express from "express";
import {authAdmin} from "../../middleware/authAdmin";
import {authSuperAdmin} from "../../middleware/authSuperAdmin";
import superAdminPrivateRouter from "./superadmin";
import categoriesAdminRouter from "./categories";
import productsAdminRouter from "./products";
import postsAdminRouter from "./posts";
import requestAdminRouter from "./requests";
import portfolioItemsSuperAdminRouter from "./portfolioItems";
import laminateItemsSuperAdminRouter from "./laminateItems";
import contactsAdminRouter from "./contacts";

const superAdminRouter = express.Router();

superAdminRouter.use(authAdmin);

superAdminRouter.use("/requests", requestAdminRouter);

superAdminRouter.use(authSuperAdmin);

superAdminRouter.use("/categories", categoriesAdminRouter);
superAdminRouter.use("/products", productsAdminRouter);
superAdminRouter.use("/posts", postsAdminRouter);
superAdminRouter.use("/admins", superAdminPrivateRouter);
superAdminRouter.use("/portfolio-items", portfolioItemsSuperAdminRouter);
superAdminRouter.use("/laminate-items", laminateItemsSuperAdminRouter);
superAdminRouter.use("/contacts", contactsAdminRouter);

export default superAdminRouter;
