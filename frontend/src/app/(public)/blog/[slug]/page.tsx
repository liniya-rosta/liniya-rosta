import {Metadata} from "next";
import {isAxiosError} from "axios";
import {fetchPostBySlug} from "@/actions/posts";
import {Post} from "@/src/lib/types";
import PostClient from "@/src/app/(public)/blog/[slug]/PostClient";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({params}: Props): Promise<Metadata> {
    try {
        const {slug} = await params;
        const post = await fetchPostBySlug(slug);

        return {
            title: post.seoTitle || post.title,
            description: post.seoDescription || `Статья: ${post.title}`,
            openGraph: {
                title: post.seoTitle || post.title,
                description: post.seoDescription || `Подробности о посте "${post.title}"`,
                images: post.images?.length
                    ? post.images.map(image => ({
                        url: image.url,
                        alt: image.alt || post.title,
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
    const {slug} = await params;

    let post: Post | null = null;
    let postError: string | null = null;

    try {
        post = await fetchPostBySlug(slug);
    } catch (e) {
        postError =
            isAxiosError(e) && e.response?.data?.error
                ? e.response.data.error
                : "Ошибка при загрузке поста";
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <PostClient data={post} error={postError}/>
        </main>
    );
}