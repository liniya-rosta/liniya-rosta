import leoProfanity from "leo-profanity";

leoProfanity.loadDictionary("en");
leoProfanity.loadDictionary("ru");

const kyrgyzBadWords = [
    "акмак",
    "келексоо",
    "ит",
    "энендиурайын",
    "шерменде",
    "айбан",
    "олугундукороюйын",
    "өлүгүндүкөрөюйын",
    "каражергекир",
    "атандыбашы",
    "атаңдыбашы",
    "кокмээ",
    "көкмээ",
    "какбаш",
    "жалап",
    "иттинбаласы",
    "шайтан",
    "жинди",
    "жинді",
    "шала",
    "сукин",
    "жалма",
    "эссиз",
];

leoProfanity.add(kyrgyzBadWords);

const normalizeText = (text: string) =>
    text.toLowerCase().replace(/і/g, "и").replace(/\s+/g, "");

export const hasBadWords = (text: string): boolean =>
    leoProfanity.check(normalizeText(text));

export const cleanText = (text: string): string =>
    leoProfanity.clean(normalizeText(text));