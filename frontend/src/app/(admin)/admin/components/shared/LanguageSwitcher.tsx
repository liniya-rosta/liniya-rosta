'use client';

import * as React from 'react';
import {usePathname, useRouter} from '@/src/i18n/navigation';
import {useLocale} from 'next-intl';
import {Earth} from 'lucide-react';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/src/components/ui/select';

export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();

    const handleChange = (newLocale: string) => {
        router.push({pathname}, {locale: newLocale});
    };

    return (
        <Select value={locale} onValueChange={handleChange}>
            <SelectTrigger className="md-min-w-[140px] text-white">
                <Earth color="white"/>
                <span className="hidden md:inline">
                    <SelectValue/>
                 </span>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ru" className='hover:bg-gray-500'>Русский</SelectItem>
                <SelectItem value="ky">Кыргызча</SelectItem>
            </SelectContent>
        </Select>
    );
}
