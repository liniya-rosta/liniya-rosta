'use client';

import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";
import { Button } from "@/src/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/src/components/ui/card";
import Loading from "@/src/components/ui/Loading/Loading";
import { Post } from "@/src/lib/types";
import { usePostsStore } from "@/store/postsStore";
import {ArrowLeft, Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import {useEffect, useState } from "react";
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {Separator} from "@radix-ui/react-separator";
import Image from "next/image";
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
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 pl-0 text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="mr-2 h-4 w-4"/>
                {tBtn("returnToBlog")}
            </Button>

            <Card className="overflow-hidden">
                <div className="relative aspect-video md:aspect-[2/1] w-full">
                    <Image
                        src={`${API_BASE_URL}/${data.images[0].image}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 1200px"
                        priority
                        onError={(e) => {
                            (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop';
                        }}
                        alt={data.title[locale]}
                        className="object-cover"
                    />
                </div>

                <CardHeader className="space-y-4 pt-6 pb-4">
                    <CardTitle
                        className="text-4xl font-extrabold leading-tight text-foreground">{data.title[locale]}</CardTitle>
                    <div className="prose prose-lg max-w-none text-muted-foreground">
                        <p className="leading-relaxed text-lg">{data.description[locale]}</p>
                    </div>
                </CardHeader>

                <CardContent className="pt-4 pb-6">
                    <Separator className="my-6"/>
                    <div className="flex justify-between items-center">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/blog')}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            ← {tBtn("allPosts")}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PostClient;