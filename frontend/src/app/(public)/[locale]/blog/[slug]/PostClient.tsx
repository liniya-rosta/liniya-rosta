'use client';

import {Alert, AlertDescription, AlertTitle} from "@/src/components/ui/alert";
import {Button} from "@/src/components/ui/button";
import {Card, CardContent} from "@/src/components/ui/card";
import Loading from "@/src/components/ui/Loading/Loading";
import {Post} from "@/src/lib/types";
import {usePostsStore} from "@/store/postsStore";
import {ArrowLeft, Terminal} from "lucide-react";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {useLocale, useTranslations} from "next-intl";
import parse from "html-react-parser";
import {Swiper, SwiperSlide} from "swiper/react";
import {Autoplay, Navigation, Pagination} from "swiper/modules";
import Image from "next/image";

interface Props {
    data: Post | null;
    error: string | null;
}

const PostClient: React.FC<Props> = ({data, error}) => {
    const router = useRouter();
    const tError = useTranslations("Errors");
    const tBtn = useTranslations("Buttons");
    const tBlog = useTranslations("BlogPage");
    const locale = useLocale() as "ru" | "ky";

    const {
        setFetchPostsError,
        fetchPostsLoading,
        setFetchPostsLoading,
        fetchPostsError: storeError
    } = usePostsStore();

    const [isHydrating, setIsHydrating] = useState(true);

    useEffect(() => {
        setFetchPostsError(error);
        setFetchPostsLoading(false);
        setIsHydrating(false);
    }, [data, error, setFetchPostsError, setFetchPostsLoading]);

    if (isHydrating || fetchPostsLoading) return <Loading/>;

    if (storeError) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
                <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4"/>
                    <AlertTitle>{tError("loadingError")}</AlertTitle>
                    <AlertDescription>
                        {tError("oneNewsError")}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-100px)]">
                <Card className="max-w-md w-full">
                    <CardContent className="pt-6 text-center">
                        <p className="text-muted-foreground text-lg">{tBlog("notFoundPost")}</p>
                        <Button onClick={() => router.push('/blog')} className="mt-4">
                            {tBtn("returnToBlog")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-[40px] pl-0 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                {tBtn("returnToBlog")}
            </Button>
            <div className="mb-[30px]">
                <h3 className="text-3xl font-extrabold leading-tight text-foreground mb-4">
                    {data.title[locale]}
                </h3>
            </div>
                <Swiper
                    loop={true}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        reverseDirection: true,
                    }}
                    modules={[Navigation, Autoplay, Pagination]}
                    pagination={{clickable: true}}
                    className="w-full rounded-2xl mb-[30px]"
                    navigation
                >
                    {data.images.map((img, i) => (
                        <SwiperSlide key={i}>
                            <div className="aspect-[4/2]">
                                <Image
                                    src={`${API_BASE_URL}/${img.image}`}
                                    alt={img.alt?.[locale] || ""}
                                    fill
                                    className="object-cover "
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    {parse(data.description[locale])}
                </div>
            </div>
    );
};

export default PostClient;