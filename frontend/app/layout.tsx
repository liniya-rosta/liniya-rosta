import type {Metadata} from "next";
import "./globals.css";
import ClientLayout from "@/components/shared/ClientLayout";
import manrope from "@/lib/fonts";
import {ToastContainer} from "react-toastify";

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
            <ClientLayout>{children}</ClientLayout>
        </div>
        <ToastContainer position="top-left" autoClose={500} />
        </body>
        </html>
    );
}
