import React from 'react';
import PostClient from './PostClient';

type Params = { id: string };

const PostPage = async ({ params }: { params: Promise<Params> }) => {
    const { id } = await params;
    return (
        <main className="container mx-auto px-4 py-8">
            <PostClient postId={id} />
        </main>
    );
};

export default PostPage;