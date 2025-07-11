'use client';

import {Link, usePathname} from "@/src/i18n/navigation";

export default function LanguageSwitcher() {
    const pathname = usePathname();

    return (
        <div>
            <Link href={pathname} locale="ru">Рус</Link> | <Link href={pathname} locale="kg">Кырг</Link>
        </div>
    );
}