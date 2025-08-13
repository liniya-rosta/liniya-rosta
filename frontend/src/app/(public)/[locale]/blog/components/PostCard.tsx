"use client"

import Image from "next/image";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/src/components/ui/card";
import Link from "next/link";
import React, {useState} from "react";
import {BtnArrow} from "@/src/components/ui/btn-arrow";
import {useLocale, useTranslations} from "next-intl";
import parse from 'html-react-parser';

interface Props {
    slug: string;
    images: { image: string, alt?: {ru: string, ky?: string} }[];
    title: string;
    description: string;
}

const PostCard: React.FC<Props> = ({slug, images, title, description}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const total = images.length;
    const tBtn = useTranslations("Buttons");
    const locale = useLocale() as "ru" | "ky";

    const showPrev = () => setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    const showNext = () => setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));

    const currentImage = images[currentIndex];

    return (
        <Card className="group relative overflow-hidden border-none shadow-none transition flex flex-col">
            <div className="relative h-56 w-full bg-gray-100">
                <Image
                    src={`${API_BASE_URL}/${currentImage.image}`}
                    alt={currentImage.alt?.[locale] || "Изображение"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-opacity duration-300 border rounded-2xl"
                    priority
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop";
                    }}
                />
                {total > 1 && (
                    <>
                        <BtnArrow
                            onClick={showPrev}
                            isLeft
                            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white z-10"
                            classNameIcon="text-black"
                        />
                        <BtnArrow
                            onClick={showNext}
                            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/50 p-1 rounded-full hover:bg-white z-10"
                            classNameIcon="text-black"
                        />
                    </>
                )}
            </div>

            <CardHeader className="px-0">
                <CardTitle className="text-lg font-semibold leading-snug line-clamp-2">{title}</CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-3 text-muted-foreground">
                    {parse(description)}
                </CardDescription>
            </CardHeader>

            <CardFooter className="px-0 pb-4 mt-auto">
                <Link href={`/blog/${slug}`} passHref>
                    <BtnArrow className="text-sm hover:underline">
                        {tBtn("detailBtn")}
                    </BtnArrow>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default PostCard;