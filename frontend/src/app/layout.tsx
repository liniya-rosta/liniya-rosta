import "./globals.css";
import manrope from "@/src/lib/fonts";
import {ToastContainer} from "react-toastify";

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="ru">
        <body className={`${manrope.variable} antialiased`}>
        {children}
        <ToastContainer position="top-left" autoClose={500}/>
        </body>
        </html>
    );
}
