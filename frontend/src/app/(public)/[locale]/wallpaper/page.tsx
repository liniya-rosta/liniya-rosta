import React from 'react';
import HeroWallpaperSection from "@/src/app/(public)/[locale]/wallpaper/components/HeroWallpaperSection";
import AdvantagesSection from "@/src/app/(public)/[locale]/wallpaper/components/AdvantagesSection";
import VisitUsSection from "@/src/app/(public)/[locale]/wallpaper/components/VisitUsSection";
import ApplicationsSection from "@/src/app/(public)/[locale]/wallpaper/components/ApplicationsSection";


const Page = () => {
    return (
        <div className="space-y-10">
            <HeroWallpaperSection/>
            <AdvantagesSection/>
            <ApplicationsSection/>
            <VisitUsSection/>
        </div>
    );
};

export default Page;