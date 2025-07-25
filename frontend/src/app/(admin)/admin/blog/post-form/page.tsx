'use client'

import CreatePostForm from "./components/CreatePostForm";
import ImageViewerModal from "@/src/components/shared/ImageViewerModal";
import React, {useState} from "react";
import {ImageObject} from "@/src/lib/types";

const Page = () => {
    const [previewImage, setPreviewImage] = useState<ImageObject | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    return (
        <div className="container mx-auto px-8">
            <div className="my-15">
                <div className="mx-auto w-[80%]">
                    <h2 className="font-bold text-3xl mb-5 text-center">Создать Пост</h2>
                    <div className="max-w-4xl mx-auto">
                        <CreatePostForm
                            setIsPreviewOpen={setIsPreviewOpen}
                            setPreviewImage={setPreviewImage}
                        />
                    </div>
                </div>
            </div>

            {previewImage && (
                <ImageViewerModal
                    open={isPreviewOpen}
                    openChange={() => setIsPreviewOpen(false)}
                    alt={previewImage.alt?.ru}
                    image={previewImage.image}
                />
            )}
        </div>
    )
}

export default Page;