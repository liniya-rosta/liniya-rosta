"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { portfolioEditSchema } from "@/src/lib/zodSchemas/admin/portfolioSchema";
import { updatePortfolioItem } from "@/actions/superadmin/portfolios";
import { useSuperAdminPortfolioStore } from "@/store/superadmin/superAdminPortfolio";
import { Button } from "@/src/components/ui/button";
import LoaderIcon from "@/src/components/ui/Loading/LoaderIcon";
import ConfirmDialog from "@/src/components/ui/ConfirmDialog";
import PortfolioBasicInfo from "./PortfolioBasicInfo";
import PortfolioImagesSection from "./PortfolioImagesSection";
import {ImageObject, PortfolioEditValues} from "@/src/lib/types";

interface Props {
    openImagesModal: () => void;
    setIsPreviewOpen: (value: boolean) => void;
    setPreviewImage: (image: ImageObject | null) => void;
}

const EditPortfolioForm: React.FC<Props> = ({openImagesModal, setPreviewImage, setIsPreviewOpen}) => {
    const { detailItem, editLoading, setPortfolioEditLoading, paginationPortfolio } =
        useSuperAdminPortfolioStore();

    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        control,
        reset,
        formState: { errors, isDirty },
    } = useForm<PortfolioEditValues>({
        resolver: zodResolver(portfolioEditSchema),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "gallery",
    });

    const [expanded, setExpanded] = useState(false);
    const [replaceAllImages, setReplaceAllImages] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (detailItem) {
            reset({
                title: { ru: detailItem.title.ru ?? ""},
                description: { ru: detailItem.description?.ru ?? "" },
                seoTitle: { ru: detailItem.seoTitle?.ru ?? "" },
                seoDescription: { ru: detailItem.seoDescription?.ru ?? "" },
                coverAlt: { ru: detailItem.coverAlt?.ru ?? "" },
            });
        }
    }, [detailItem, reset]);

    if (!detailItem) return null;

    const handleConfirm = (type: string) => {
        if (type === "replace") {
            setReplaceAllImages(true);
            remove();
            append({alt: {ru: ""}, image: null});
        } else if (type === "append") {
            setReplaceAllImages(false);
        }
    }

    const onSubmit = async (data: PortfolioEditValues) => {
        try {
            setPortfolioEditLoading(true);

            if (replaceAllImages) {
                await updatePortfolioItem({
                    id: detailItem._id,
                    data,
                    mode: "replace",
                });
            } else {
                await updatePortfolioItem({
                    id: detailItem._id,
                    data,
                    mode: "append",
                });
            }

            toast.success("Портфолио обновлено");
            router.push(
                paginationPortfolio
                    ? `/admin/portfolio?page=${paginationPortfolio.page}`
                    : "/admin/portfolio"
            );
        } catch {
            toast.error("Ошибка при обновлении портфолио");
        } finally {
            setPortfolioEditLoading(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <PortfolioBasicInfo
                register={register}
                errors={errors}
                updateLoading={editLoading}
                />

                <PortfolioImagesSection
                    fields={fields}
                    expanded={expanded}
                    setExpanded={setExpanded}
                    append={append}
                    remove={remove}
                    register={register}
                    setPreviewImage={setPreviewImage}
                    setIsPreviewOpen={setIsPreviewOpen}
                    openImagesModal={openImagesModal}
                    control={control}
                    errors={errors}
                    loading={editLoading}
                    replaceAllImages={replaceAllImages}
                    setReplaceAllImages={setReplaceAllImages}
                    requestConfirmation={(type) => {
                        handleConfirm(type)
                    }}
                    setValue={setValue}
                />

                <div className="flex gap-4 mt-6">
                    <Button type="submit" disabled={editLoading || !isDirty}>
                        {editLoading && <LoaderIcon />}
                        Сохранить изменения
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setShowConfirm(true);
                        }}
                    >
                        Отмена
                    </Button>
                </div>
            </form>

            <ConfirmDialog
                open={showConfirm}
                onOpenChange={setShowConfirm}
                title="Покинуть страницу?"
                text="Если уйти, изменения не сохранятся."
                onConfirm={() => {
                    setShowConfirm(false);
                    router.push("/admin/portfolio");
                }}
                loading={editLoading}
            />
        </>
    );
};

export default EditPortfolioForm;