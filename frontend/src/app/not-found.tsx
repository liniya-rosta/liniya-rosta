'use client';

import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const NotFound = () => {
    const t = useTranslations('NotFound');

    return (
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-4">
            <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
            <p className="text-muted-foreground text-lg mb-6">
                {t('description')}
            </p>
            <Link href="/">
                <Button className="flex items-center gap-2">
                    <ArrowLeft size={16}/>
                    {t('backHome')}
                </Button>
            </Link>
        </div>
    );
};

export default NotFound;