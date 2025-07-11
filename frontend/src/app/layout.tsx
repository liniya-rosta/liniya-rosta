import './globals.css';
import type { Metadata } from 'next';
import manrope from '../../lib/fonts'

export const metadata: Metadata = {
    title: 'Линия роста',
    description: '',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ru" className={manrope.variable}>
        <body className="antialiased">
        {children}
        </body>
        </html>
    );
}