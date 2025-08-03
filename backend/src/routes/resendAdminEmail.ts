import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminMail(email: string, name: string, role: string) {
    return resend.emails.send({
        from: "Admin <admin@onboarding.resend.dev>",
        to: email,
        subject: `Вы назначены ${role} Линии Роста`,
        html: `<p>Привет, ${name}!</p><p>Вы теперь ${role} сайта.</p>`,
    });
}