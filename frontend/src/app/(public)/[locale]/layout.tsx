import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/src/components/shared/Header";
import Footer from "@/src/components/shared/Footer/Footer";

export default async function LocaleLayout({
                                               children,
                                               params
                                           }: {
    children: React.ReactNode;
    params: Promise<{ locale: 'ru' | 'ky' }>;
}) {
    const { locale } = await params;

    const messages = await getMessages({ locale });

    return (
        <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
            </div>
        </NextIntlClientProvider>
    );
}