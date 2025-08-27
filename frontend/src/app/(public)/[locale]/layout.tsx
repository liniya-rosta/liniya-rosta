import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import Header from "@/src/components/shared/Header";
import Footer from "@/src/components/shared/Footer/Footer";
import type {Metadata} from "next";
import ChatContainer from "@/src/components/shared/OnlineChat/ChatContainer";
import React from "react";

const BASE = "https://liniya-rosta.com";

export async function generateMetadata({params}: { params: Promise<{ locale: 'ru' | 'ky' }> }): Promise<Metadata> {
    const {locale} = await params;
    const canon = `${BASE}/${locale}`;

    return {
        metadataBase: new URL(BASE),
        alternates: {
            canonical: canon,
            languages: {
                ru: `${BASE}/ru`,
                ky: `${BASE}/ky`,
                "x-default": BASE,
            },
        },
        title: {
            template: '%s | Линия Роста',
            default: 'Линия Роста',
        },
        description: "Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке. Качество, гарантия и профессиональная установка от компании «Линия Роста».",
        openGraph: {
            title: 'Линия Роста',
            description: 'Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке.',
            url: canon,
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
        },

        twitter: {
            card: "summary_large_image",
            title: "Линия Роста",
            description: "Натяжные потолки, SPC ламинат, багеты и интерьерные решения в Бишкеке.",
            images: [`/images/services/main-service.JPG`],
        },
    };
}

    export default async function LocaleLayout({
                                                   children,
                                                   params
                                               }: {
        children: React.ReactNode;
        params: Promise<{ locale: 'ru' | 'ky' }>;
    }) {
        const {locale} = await params;

        const messages = await getMessages({locale});

        return (
            <NextIntlClientProvider locale={locale} messages={messages}>
                <div className="min-h-screen flex flex-col">
                    <Header/>
                    <main className="flex-grow">{children}</main>
                    <ChatContainer/>
                    <Footer/>
                </div>
            </NextIntlClientProvider>
        );
    }