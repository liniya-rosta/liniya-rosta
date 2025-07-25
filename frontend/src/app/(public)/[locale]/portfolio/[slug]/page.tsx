import {Metadata} from "next";
import {fetchPortfolioItemBySlug} from "@/actions/portfolios";
import GalleryClient from "@/src/app/(public)/[locale]/portfolio/[slug]/GalleryClient";
import {getTranslations} from "next-intl/server";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug} = await params;
        const item = await fetchPortfolioItemBySlug(slug);

        return {
            title: item.seoTitle || item.coverAlt.ru,
            description: item.seoDescription || `Галерея: ${item.coverAlt.ru}`,
            openGraph: {
                title: item.seoTitle || item.coverAlt.ru,
                description: item.seoDescription || `Просмотрите фотографии проекта "${item.coverAlt.ru}"`,
                images: [
                    {
                        url: item.cover,
                        alt: item.coverAlt.ru || "Галерея",
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
    const tError = await getTranslations("Errors")


    try {
        const {slug} = await params;
        detailItem = await fetchPortfolioItemBySlug(slug);
    } catch (error) {
            errorMessage = tError("galleryError");
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
                Галерея
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">{detailItem?.description.ru}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage} />
        </main>
    );
};

export default GalleryPage;
