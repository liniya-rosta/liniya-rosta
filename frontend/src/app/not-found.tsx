import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {getTranslations} from "next-intl/server";

const NotFound = async () => {
    const t = await getTranslations('NotFound');

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