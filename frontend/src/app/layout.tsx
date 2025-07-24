import './globals.css';
import type { Metadata } from 'next';
import manrope from '@/src/lib/fonts'
import {ToastContainer} from "react-toastify";

export const metadata: Metadata = {
    title: 'Линия роста',
    description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className={manrope.variable}>
        <body className="antialiased">
        {children}
        <ToastContainer
            autoClose={1000}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
        />
        </body>
        </html>
    );
}