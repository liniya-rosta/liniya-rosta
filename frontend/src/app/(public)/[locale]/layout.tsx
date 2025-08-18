import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Header from "@/src/components/shared/Header";
import Footer from "@/src/components/shared/Footer/Footer";
import type {Metadata} from "next";
import ChatContainer from "@/src/components/shared/OnlineChat/ChatContainer";
import React from "react";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL!),
    title: {
        template: '%s | Линия Роста',
        default: 'Линия Роста',
    },
    description: "Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке. Качество, гарантия и профессиональная установка от компании «Линия Роста».",
    openGraph: {
        title: 'Линия Роста',
        description: 'Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке.',
        url: '/',
        siteName: 'Линия Роста',
        images: [
            {
                url: `/images/services/main-service.JPG`,
                width: 1200,
                height: 630,
                alt: 'Натяжные потолки и ламинат в Бишкеке от Линии Роста',
            },
        ],
        type: 'website',
    }
};

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
                <ChatContainer/>
                <Footer />
            </div>
        </NextIntlClientProvider>
    );
}