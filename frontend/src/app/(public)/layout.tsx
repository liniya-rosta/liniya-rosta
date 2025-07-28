import Header from "@/src/components/shared/Header";
import Footer from "@/src/components/shared/Footer/Footer";
import type {Metadata} from "next";

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

export default function PublicLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header/>
            <main className="flex-grow">{children}</main>
            <Footer/>
        </div>
    );
}