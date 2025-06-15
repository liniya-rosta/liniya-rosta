import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import categoryRouter from "./src/routes/categories";
import productRouter from "./src/routes/products";
import postRouter from "./src/routes/posts";
import usersRouter from "./src/routes/users";
import superAdminRouter from "./src/routes/superadmin";
import requestRouter from "./src/routes/requests";
import portfolioItemRouter from "./src/routes/portfolioItems";
import laminateItemsRouter from "./src/routes/laminateItems";
import contactsRouter from "./src/routes/contacts";
import path from "path";

const app = express();
const port = 8000;

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.static("public"));
app.use('/post', express.static(path.join(config.publicPath, 'posts')));
app.use('/product', express.static(path.join(config.publicPath, 'products')));
app.use('/portfolio', express.static(path.join(config.publicPath, 'portfolio')));
app.use('/laminate', express.static(path.join(config.publicPath, 'laminate')));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/superadmin', superAdminRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/posts', postRouter);
app.use('/requests', requestRouter)
app.use('/portfolio-items', portfolioItemRouter);
app.use('/laminate-items', laminateItemsRouter);
app.use('/contacts', contactsRouter);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on("exit", () => {
        mongoose.disconnect();
    });
};

run().catch(console.error);
