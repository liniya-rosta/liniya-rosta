import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, "../public"),
    db: process.env.MONGODB_URI || "mongodb://mongo:27017/liniya-rosta",

};

export default config;