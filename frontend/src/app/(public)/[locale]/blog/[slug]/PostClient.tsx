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

    console.log(data?.images)

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
            <div className="grid grid-cols-1 gap-4 mb-8">
                {data.images.length === 1 && (
                    <div className="aspect-[6/3] overflow-hidden rounded-xl">
                        <img
                            src={`${API_BASE_URL}/${data.images[0].image}`}
                            alt={data.images[0].alt?.[locale]}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {data.images.length === 2 && (
                    <div className="grid aspect-[6/3] grid-cols-2 gap-4">
                        {data.images.map((img, i) => (
                            <div key={i} className="overflow-hidden rounded-xl">
                                <img
                                    src={`${API_BASE_URL}/${img.image}`}
                                    alt={img.alt?.[locale]}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {data.images.length === 3 && (
                    <div className="grid grid-cols-5 gap-4 aspect-[7/3] ">
                        <div className="col-span-4 row-span-2 overflow-hidden rounded-lg">
                            <img
                                src={`${API_BASE_URL}/${data.images[0].image}`}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={`${API_BASE_URL}/${data.images[1].image}`}
                                alt=""
                                className="w-full h-full object-cover aspect-square"
                            />
                        </div>

                        <div className="overflow-hidden rounded-lg">
                            <img
                                src={`${API_BASE_URL}/${data.images[2].image}`}
                                alt=""
                                className="w-full h-full object-cover aspect-square"
                            />
                        </div>
                    </div>
                )}

                <div className="prose prose-lg max-w-none text-muted-foreground">
                    <p className="leading-relaxed text-lg">{data.description[locale]}</p>
                </div>
            </div>
        </div>


    );
};

export default PostClient;