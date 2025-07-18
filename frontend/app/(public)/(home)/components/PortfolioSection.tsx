import Link from "next/link";
import {CartPortfolio} from "@/app/(public)/portfolio/components/CartPortfolio";
import {API_BASE_URL} from "@/lib/globalConstants";
import React from "react";
import {usePortfolioStore} from "@/store/portfolioItemStore";
import {BtnArrow} from "@/components/ui/btn-arrow";

const PortfolioSection = () => {
    const {
        items: storedPortfolioItems,
    } = usePortfolioStore();

    return (
        <section className="space-y-6" aria-labelledby="portfolio-heading">
            <div role="presentation" className="relative flex justify-end items-center mx-auto">
                <h2
                    id="portfolio-heading"
                    className="main-section-title text-20-30-1_2 absolute left-1/2 -translate-x-1/2"
                >
                    Наши работы
                </h2>
                <BtnArrow variant="link" className="hidden md:inline-flex">
                    <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline">
                        Все работы
                    </Link>
                </BtnArrow>
            </div>

            {storedPortfolioItems && storedPortfolioItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {storedPortfolioItems.map((item) => (
                        <Link key={item._id} href={`/portfolio/${item._id}`}>
                            <CartPortfolio
                                textBtn={"Смотреть все"}
                                imageSrc={`${API_BASE_URL}/${item.cover}`}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center">Нет портфолио</p>
            )}

            <div className="flex justify-center md:hidden">
                <BtnArrow variant="link">
                    <Link href="/portfolio" className="text-primary text-sm font-medium hover:underline">
                        Все работы
                    </Link>
                </BtnArrow>
            </div>
        </section>
    );
};

export default PortfolioSection;