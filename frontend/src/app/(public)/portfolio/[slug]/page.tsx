import {Metadata} from "next";
import {fetchPortfolioItemBySlug} from "@/actions/portfolios";
import {isAxiosError} from "axios";
import GalleryClient from "@/src/app/(public)/portfolio/[slug]/GalleryClient";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug} = await params;
        const item = await fetchPortfolioItemBySlug(slug);

        return {
            title: item.seoTitle || item.coverAlt,
            description: item.seoDescription || `Галерея: ${item.coverAlt}`,
            openGraph: {
                title: item.seoTitle || item.coverAlt,
                description: item.seoDescription || `Просмотрите фотографии проекта "${item.coverAlt}"`,
                images: [
                    {
                        url: item.cover,
                        alt: item.coverAlt || "Галерея",
                    },
                ],
                type: "website",
            },
        };
    } catch {
        return {
            title: "Галерея не найдена",
            description: "Информация о галерее недоступна",
        };
    }
}

const GalleryPage = async ({params}: Props) => {
    let errorMessage: string | null = null;
    let detailItem = null;

    try {
        const {slug} = await params;
        detailItem = await fetchPortfolioItemBySlug(slug);
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            errorMessage = error.response.data.error;
        } else if (error instanceof Error) {
            errorMessage = error.message;
        } else {
            errorMessage = "Неизвестная ошибка при загрузке  галереи";
        }
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
                Галерея
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">{detailItem?.description}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage}/>
        </main>
    );
};

export default GalleryPage;
