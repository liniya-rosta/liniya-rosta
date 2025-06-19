import React from "react";
import {Post} from "@/lib/types";
import {fetchPosts} from "@/actions/posts";
import AdminBlogClient from "@/app/(admin)/admin/blog/AdminBlogClient";

const AdminBlogPage = async () => {
    let posts: Post[] = [];
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg border-gray-200 p-6">
                    <AdminBlogClient
                        data={posts}
                        error={postsError}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminBlogPage;