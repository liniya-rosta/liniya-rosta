import {useState} from "react";
import {PostResponse} from "@/src/lib/types";
import {getPaginationButtons} from "@/src/lib/utils";
import {usePostsStore} from "@/store/postsStore";
import {fetchPosts} from "@/actions/posts";
import {handleKyError} from "@/src/lib/handleKyError";

export const useBlogFetcher = (limit: string) => {
    const {
        paginationPosts,
        setFetchPostsLoading,
        setPaginationPosts,
        setFetchPostsError,
        setPosts,
    } = usePostsStore();

    const [page, setPage] = useState(1);
    let paginationButtons: (string | number)[] | null = null;

    if (paginationPosts)
        paginationButtons = getPaginationButtons(page, paginationPosts.totalPages);

    const updatedData = async (initialData?: PostResponse | null, newPage?: number) => {
        try {
            setFetchPostsLoading(true);
            let data: PostResponse;

            if (initialData) {
                data = initialData;
            } else {
                data = await fetchPosts(limit, String(newPage));
            }
            setPosts(data.items);

            setPaginationPosts({
                total: data.total,
                page: data.page,
                pageSize: data.pageSize,
                totalPages: data.totalPages,
            });

            setFetchPostsError(null);
        } catch (error) {
            const errorMessage = await handleKyError(error, "Неизвестная ошибка при загрузке постов");
            setFetchPostsError(errorMessage);
        } finally {
            setFetchPostsLoading(false);
        }
    }

    const handlePageChange = async (newPage: number) => {
        await updatedData(null, newPage);
        setPage(newPage);
    };

    return {
        page,
        setPage,
        updatedData,
        handlePageChange,
        paginationButtons,
    };
};
