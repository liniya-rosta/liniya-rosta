import kyAPI from "@/src/lib/kyAPI";

export const sendWhatsAppMessage = async (to: string, message: string) => {
    return await kyAPI
        .post("whats-app/send-whatsapp", {
            json: { to, message }
        })
        .json<{ success: boolean; sid: string }>();
};
