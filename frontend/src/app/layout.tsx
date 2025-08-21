import "./globals.css";
import manrope from "@/src/lib/fonts";
import {ToastContainer} from "react-toastify";
import Head from "next/head";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <Head>
            <link rel="icon" href="/logo.png" />
        </Head>
        <body className={`${manrope.variable} antialiased`}>
        {children}
        <ToastContainer position="top-left" autoClose={3000} pauseOnHover={true}/>
        </body>
        </html>
    );
}
