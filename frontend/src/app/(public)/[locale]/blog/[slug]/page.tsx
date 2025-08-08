import {Metadata} from "next";
import {isAxiosError} from "axios";
import {fetchPostBySlug} from "@/actions/posts";
import {Post} from "@/src/lib/types";
import PostClient from "@/src/app/(public)/[locale]/blog/[slug]/PostClient";
import {getTranslations} from "next-intl/server";

type Props = {
    params: { slug: string; locale: 'ru' | 'ky' };
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug, locale} = params;
        const post = await fetchPostBySlug(slug);

        const title = post.seoTitle?.[locale] || post.title?.[locale];
        const description = post.seoDescription?.[locale] || `Подробнее о продукте "${post.title?.[locale]}"`;

        return {
            title,
            description,
            openGraph: {
                title: title,
                description,
                images: post.images?.length
                    ? post.images.map(image => ({
                        url: image.image,
                        alt: image.alt?.ru || post.title.ru,
                    }))
                    : [],
                type: "article",
            },
        };
    } catch {
        return {
            title: "Пост не найден",
            description: "Информация о посте недоступна",
        };
    }
}

export default async function PostPage({params}: Props) {
    const {slug} = params;
    const tError = await getTranslations("Errors")

    let post: Post | null = null;
    let postError: string | null = null;

    try {
        post = await fetchPostBySlug(slug);
    } catch (e) {
        postError =
            isAxiosError(e) && e.response?.data?.error
                ? e.response.data.error
                : tError("onePostError");
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <PostClient data={post} error={postError}/>
        </main>
    );
}