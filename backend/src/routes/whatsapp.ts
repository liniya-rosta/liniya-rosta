import express from "express";
import twilio from "twilio";
import config from "../../config";

const whatsappRouter = express.Router();
const client = twilio(config.twilio.account_sid, config.twilio.token);

whatsappRouter.post("/send-whatsapp", async (req, res, next) => {
    const { to, message } = req.body;

    try {
        const msg = await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${to}`
        });

        res.send({ success: true, sid: msg.sid });
    } catch (err) {
       next(err)
    }
});

export default whatsappRouter;