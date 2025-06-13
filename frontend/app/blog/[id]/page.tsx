import React from 'react';
import PostClient from './PostClient';

type Props = {
    params: { id: string };
};

const PostPage = ({ params }: Props) => {
    return (
        <main className="container mx-auto px-4 py-8">
            <PostClient postId={params.id} />
        </main>
    );
};

export default PostPage;