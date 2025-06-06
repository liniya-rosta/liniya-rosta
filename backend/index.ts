import express from "express";
import * as mongoose from "mongoose";
import cors from "cors";
import config from "./config";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
//admin
//category
//product
app.use(express.static("public"));

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
