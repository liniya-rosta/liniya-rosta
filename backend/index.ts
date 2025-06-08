import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config";
import categoryRouter from "./routers/categories";
import productRouter from "./routers/products";
import postRouter from "./routers/posts";
import usersRouter from "./routers/users";
import superAdminRouter from "./routers/superadmin";
import requestRouter from "./routers/requests";

const app = express();
const port = 8000;

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);
app.use(cookieParser());
app.use(express.static("public"));
app.use(express.json());

app.use('/users', usersRouter);
app.use('/superadmin', superAdminRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/posts', postRouter);
app.use('/requests', requestRouter)

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
