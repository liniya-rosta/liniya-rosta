import path from "path";

const rootPath = __dirname;

const config = {
    rootPath,
    publicPath: path.join(rootPath, "public"),
    db: "mongodb://localhost/liniya-rosta",
    twilio: {
        account_sid: process.env.TWILIO_ACCOUNT_SID,
        token: process.env.TWILIO_AUTH_TOKEN,
    }
};

export default config;
