import dotenv from "dotenv";
dotenv.config();

export async function translateYandex(text: string, targetLang = "ky") {
    const apiKey = process.env.YANDEX_API_KEY;
    const folderId = process.env.YANDEX_FOLDER_ID;

    const response = await fetch("https://translate.api.cloud.yandex.net/translate/v2/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Api-Key ${apiKey}`,
        },
        body: JSON.stringify({
            folderId,
            texts: [text],
            targetLanguageCode: targetLang,
            format: "PLAIN_TEXT",
        }),
    });

    const data = await response.json();

    console.log(data);

    if (data.translations && data.translations.length > 0) {
        return data.translations[0].text;
    } else {
        throw new Error("Не удалось перевести текст");
    }
}
