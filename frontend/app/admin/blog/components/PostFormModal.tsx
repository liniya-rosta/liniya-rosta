import React, { useEffect, useState, useRef } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { API_BASE_URL } from '@/lib/globalConstants';
import { Post, CreatePostData, UpdatePostData } from "@/lib/types";
import { CreatePostFormData, createPostSchema, UpdatePostFormData, updatePostSchema } from '@/lib/zodSchemas/postSchema';

interface PostFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    editingPost: Post | null;
    actionLoading: boolean;
    onSubmit: (formData: CreatePostData | UpdatePostData, isEditingMode: boolean) => void;
}

const PostFormModal: React.FC<PostFormModalProps> = ({isOpen, onClose, isEditing, editingPost, actionLoading, onSubmit,}) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const createForm = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: '',
            description: '',
            image: undefined,
        },
    });

    const updateForm = useForm<UpdatePostFormData>({
        resolver: zodResolver(updatePostSchema),
        defaultValues: {
            title: '',
            description: '',
            image: undefined,
        },
    });

    const currentForm = (isEditing ? updateForm : createForm) as UseFormReturn<CreatePostFormData | UpdatePostFormData>;

    useEffect(() => {
        if (isEditing && editingPost) {
            updateForm.reset({
                title: editingPost.title,
                description: editingPost.description,
                image: undefined,
            });
            if (editingPost.image) {
                setImagePreviewUrl(`${API_BASE_URL}/${editingPost.image}`);
            } else {
                setImagePreviewUrl(null);
            }
        } else {
            createForm.reset();
            setImagePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        currentForm.clearErrors();
    }, [isEditing, editingPost, createForm, updateForm, currentForm]);


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (...event: any[]) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
            fieldOnChange(file);
        } else {
            setImagePreviewUrl(null);
            fieldOnChange(undefined);
        }
        currentForm.trigger('image');
    };

    const clearImage = () => {
        currentForm.setValue('image', null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        currentForm.trigger('image');
    };

    const handleSubmit = async (data: CreatePostFormData | UpdatePostFormData) => {
        if (!isEditing && !(data as CreatePostFormData).image) {
            currentForm.setError('image', {
                type: 'manual',
                message: 'Изображение обязательно для нового поста',
            });
            return;
        }
        onSubmit(data, isEditing);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Редактировать пост' : 'Создать новый пост'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Внесите изменения в пост и нажмите сохранить'
                            : 'Заполните форму для создания нового поста'
                        }
                    </DialogDescription>
                </DialogHeader>

                <Form {...currentForm}>
                    <form onSubmit={currentForm.handleSubmit(handleSubmit)} className="space-y-6">

                        <FormField
                            control={currentForm.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Заголовок *</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Введите заголовок поста"
                                            disabled={actionLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={currentForm.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Описание *</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Краткое описание поста"
                                            rows={4}
                                            disabled={actionLoading}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={currentForm.control}
                            name="image"
                            render={({ field: { onChange } }) => (
                                <FormItem>
                                    <FormLabel>Изображение {isEditing ? '' : '*'}</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={actionLoading}
                                                className="w-full"
                                            >
                                                {imagePreviewUrl ? 'Изменить изображение' : 'Выбрать изображение'}
                                            </Button>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) => handleImageChange(e, onChange)}
                                                disabled={actionLoading}
                                                className="hidden"
                                            />

                                            {imagePreviewUrl && (
                                                <div className="relative inline-block mt-2">
                                                    <Image
                                                        src={imagePreviewUrl}
                                                        alt="Image Preview"
                                                        fill
                                                        sizes="128px"
                                                        className="object-cover rounded-lg border"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={clearImage}
                                                        disabled={actionLoading}
                                                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                                                    >
                                                        X
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={actionLoading}
                            >
                                Отмена
                            </Button>
                            <Button type="submit" disabled={actionLoading}>
                                {actionLoading
                                    ? 'Сохранение...'
                                    : isEditing
                                        ? 'Сохранить изменения'
                                        : 'Создать пост'
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PostFormModal;