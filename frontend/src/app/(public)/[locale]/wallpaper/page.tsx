import React from 'react';
import HeroWallpaperSection from "@/src/app/(public)/[locale]/wallpaper/components/HeroWallpaperSection";
import AdvantagesSection from "@/src/app/(public)/[locale]/wallpaper/components/AdvantagesSection";
import VisitUsSection from "@/src/app/(public)/[locale]/wallpaper/components/VisitUsSection";
import ApplicationsSection from "@/src/app/(public)/[locale]/wallpaper/components/ApplicationsSection";
import {Metadata} from "next";
import {getTranslations} from "next-intl/server";
import WallpaperList from "@/src/app/(public)/[locale]/wallpaper/components/WallpaperList/WallpaperList";
import {Product} from "@/src/lib/types";
import {fetchCategories} from "@/actions/categories";
import {fetchProducts} from "@/actions/products";
import {handleKyError} from "@/src/lib/handleKyError";

export const revalidate = 1800;

export const generateMetadata = async (): Promise<Metadata> => {
    const t = await getTranslations("WallpaperPage");
    const tHeader = await getTranslations("Header");

    return {
        title: tHeader("headerLinks.stretchWallpaper"),
        description: t("descriptionSeo"),
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: '/wallpaper',
            siteName: "Линия Роста",
            images: [
                {
                    url: '/images/wallpaper/main-bg-wallpaper.jpeg',
                    width: 1200,
                    height: 630,
                    alt: tHeader("headerLinks.stretchWallpaper"),
                },
            ],
            type: "website",
        },
    };
};

const Page = async () => {
    let wallpaperData: Product[] | null = null;
    let error: string | null = null;
    const tError = await getTranslations('Errors');

    try {
        const categorySlug = 'stretch-wallpaper';
        const categories = await fetchCategories(categorySlug);
        const wallpaperCategory = categories[0];

        const wallpaperResponse = await fetchProducts({categoryId: wallpaperCategory._id});
        wallpaperData = wallpaperResponse.items;
    } catch (e) {
        error = await handleKyError(e, tError('wallpaperError'));
    }

    return (
        <div className="space-y-10">
            <HeroWallpaperSection/>
            <AdvantagesSection/>
            <ApplicationsSection/>
            <VisitUsSection/>

            <WallpaperList error={error} initialData={wallpaperData} />
        </div>
    );
};

export default Page;