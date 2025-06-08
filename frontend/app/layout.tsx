import type {Metadata} from "next";
import "./globals.css";
import {Manrope} from 'next/font/google';
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export const manrope = Manrope({
    subsets: ['latin', 'cyrillic'],
    variable: '--font-manrope',
    display: 'swap',
});

export const metadata: Metadata = {
    title: "Линия роста",
    description: "",
};

export default function RootLayout({children,}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
        <body
            className={`${manrope.variable} antialiased`}
        >
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-grow">{children}</main>
            <Footer/>
        </div>
        </body>
        </html>
    );
}
