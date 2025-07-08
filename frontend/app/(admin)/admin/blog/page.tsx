import React from "react";
import {PostResponse} from "@/lib/types";
import {fetchPosts} from "@/actions/posts";
import AdminBlogClient from "@/app/(admin)/admin/blog/AdminBlogClient";

const AdminBlogPage = async () => {
    let posts: PostResponse | null;
    let postsError: string | null = null;

    try {
        posts = await fetchPosts();
    } catch (e) {
        if (e instanceof Error) {
            postsError = e.message;
        } else {
            postsError = 'Неизвестная ошибка на сервере при загрузке постов.';
        }
    }

    return (
        <div>
            <AdminBlogClient
                data={posts}
                error={postsError}
            />
        </div>
    );
};

export default AdminBlogPage;