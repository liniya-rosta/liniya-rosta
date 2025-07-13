'use client';

import * as React from 'react';
import {usePathname, useRouter} from '@/src/i18n/navigation';
import {useLocale} from 'use-intl';
import { Earth } from 'lucide-react';
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
            <SelectTrigger className="min-w-[140px]  border border-white text-white">
                <Earth /> <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-muted text-white border border-white">
                <SelectItem value="ru" className="text-white hover:bg-white/10">Русский</SelectItem>
                <SelectItem value="ky" className="text-white hover:bg-white/10">Кыргызча</SelectItem>
            </SelectContent>
        </Select>
    );
}
