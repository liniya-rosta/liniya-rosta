import express from "express";
import twilio from "twilio";

const whatsappRouter = express.Router();
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

whatsappRouter.post("/send-whatsapp", async (req, res, next) => {
    const { to, message } = req.body;

    try {
        const msg = await client.messages.create({
            body: message,
            from: "whatsapp:+14155238886",
            to: `whatsapp:${to}`
        });

        res.json({ success: true, sid: msg.sid });
    } catch (err) {
       next(err)
    }
});

export default whatsappRouter;