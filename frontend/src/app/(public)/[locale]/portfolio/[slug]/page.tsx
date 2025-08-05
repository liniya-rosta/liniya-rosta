import {Metadata} from "next";
import {fetchPortfolioItemBySlug} from "@/actions/portfolios";
import GalleryClient from "@/src/app/(public)/[locale]/portfolio/[slug]/GalleryClient";
import {getLocale, getTranslations} from "next-intl/server";

type Props = {
    params: { slug: string; locale: 'ru' | 'ky' };
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug, locale} = params;
        const item = await fetchPortfolioItemBySlug(slug);

        return {
            title: item.seoTitle?.[locale] || item.coverAlt?.[locale],
            description: item.seoDescription?.[locale] || `Галерея: ${item.coverAlt?.[locale]}`,
            openGraph: {
                title: item.seoTitle?.[locale] || item.coverAlt?.[locale],
                description: item.seoDescription?.[locale] || `Просмотрите фотографии проекта "${item.coverAlt?.[locale]}"`,
                images: [
                    {
                        url: item.cover,
                        alt: item.coverAlt?.[locale] || "Галерея",
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
    const locale = await getLocale() as 'ru' | 'ky';

    try {
        const {slug} = await params;
        detailItem = await fetchPortfolioItemBySlug(slug);
    } catch {
        errorMessage = tError("galleryError");
    }

    return (
        <main className="container mx-auto px-4">
            <h1 className="text-3xl font-bold text-foreground">
                Галерея
            </h1>
            <p className="mb-8 text-lg text-muted-foreground">{detailItem?.description[locale]}</p>
            <GalleryClient detailItem={detailItem} error={errorMessage}/>
        </main>
    );
};

export default GalleryPage;
