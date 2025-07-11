import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
    locales: ['ru', 'ky'],


    defaultLocale: 'ru',

    localePrefix: 'always' // Всегда показывать префикс локали в URL
});

// Типы для TypeScript
export type Locale = (typeof routing.locales)[number];
