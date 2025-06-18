// app/layout.tsx
import "./globals.css";
import type {Metadata} from "next";
import manrope from "@/lib/fonts";
import {ToastContainer} from "react-toastify";

export const metadata: Metadata = {
    title: "Линия роста",
    description: "",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body className={`${manrope.variable} antialiased`}>
        {children}
        <ToastContainer position="top-left" autoClose={500} />
        </body>
        </html>
    );
}
