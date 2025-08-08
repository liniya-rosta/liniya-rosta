export function extractTags(text: string) {
    const tags: string[] = [];
    const cleanText = text.replace(/<[^>]*>/g, (tag) => {
        tags.push(tag);
        return `[[[_${tags.length - 1}]]]`;
    });
    return { cleanText, tags };
}

export function restoreTags(translatedText: string, tags: string[]) {
    return translatedText.replace(/\[\[\[_(\d+)]]]/g, (_, index) => tags[Number(index)]);
}