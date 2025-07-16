"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import axiosAPI from "@/lib/axiosAPI";
import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
import {isAxiosError} from "axios";
import LoaderIcon from "@/components/ui/LoaderIcon";

const CreateCategoryForm: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const { setCategories, categories, setCreateCategoryError } = useAdminCategoryStore();

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await axiosAPI.post("/superadmin/categories", { title });
            toast.success("Категория успешно создана");
            setCategories([...categories, res.data.category]);
            setTitle("");
            onClose();
        } catch (e) {
            const message =
                isAxiosError(e) && e.response?.data?.error
                    ? e.response.data.error
                    : "Ошибка при создании категории";

            setCreateCategoryError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Создание категории</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Input
                        placeholder="Название категории"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />
                    <Button onClick={handleSubmit} disabled={loading || !title.trim()} className="w-full">
                        {loading ? <LoaderIcon/> : "Создать"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateCategoryForm;