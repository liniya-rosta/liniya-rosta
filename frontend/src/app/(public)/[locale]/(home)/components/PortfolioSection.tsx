import Link from "next/link";
import {CartPortfolio} from "@/src/app/(public)/[locale]/portfolio/components/CartPortfolio";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import React from "react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import { useTranslations } from "next-intl";

const PortfolioSection = () => {
    const {
        items: storedPortfolioItems,
    } = usePortfolioStore();

    const tHome = useTranslations("HomePage");
    const tBtn = useTranslations("Buttons")

    return (

        <section className="space-y-6" aria-labelledby="portfolio-heading">
            <div role="presentation" className="flex justify-between items-center mx-auto">
                <h2 id="portfolio-heading" className="text-3xl font-bold">{tHome("portfolioTitle")}</h2>
                <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline">
                    {tBtn("allWorksBtn")} →
                </Link>
            </div>
            {storedPortfolioItems && storedPortfolioItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {storedPortfolioItems.map((item) => (
                        <Link key={item._id} href={`/portfolio/${item._id}`}>
                            <CartPortfolio
                                imageSrc={`${API_BASE_URL}/${item.cover}`}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center">{tHome("noPortfolio")}</p>
            )}
        </section>

    );
};

export default PortfolioSection;