import React from 'react';
import { Post } from "@/src/lib/types";
import { fetchPostById } from "@/actions/posts";
import PostClient from "@/src/app/(public)/[locale]/blog/[id]/PostClient";

type Params = { id: string };

interface Props {
    params: Promise<Params>;
}

const PostPage = async ({ params }: Props) => {
    const { id } = await params;

    let post: Post | null = null;
    let postError: string | null = null;

    try {
        post = await fetchPostById(id);
    } catch (e) {
        console.error('Error fetching post:', e);
        if (e instanceof Error) {
            postError = e.message;
        } else {
            postError = 'Неизвестная ошибка на сервере при загрузке поста.';
        }
    }

    return (
        <main className="container mx-auto px-4 py-8">
            <PostClient data={post} error={postError} />
        </main>
    );
};

export default PostPage;