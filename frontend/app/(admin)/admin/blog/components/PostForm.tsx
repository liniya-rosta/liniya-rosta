import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { X } from 'lucide-react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { API_BASE_URL } from '@/lib/globalConstants';
import { Post } from "@/lib/types";
import { CreatePostFormData, createPostSchema, UpdatePostFormData, updatePostSchema } from '@/lib/zodSchemas/postSchema';

interface PostFormProps {
    isEditing: boolean;
    editingPost: Post | null;
    actionLoading: boolean;
    createError: string | null;
    updateError: string | null;
    onSubmit: (formData: CreatePostFormData | UpdatePostFormData, isEditingMode: boolean) => void;
    onCancel: () => void;
}

const PostForm: React.FC<PostFormProps> = ({isEditing, editingPost, actionLoading, createError, updateError, onSubmit, onCancel}) => {
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<CreatePostFormData | UpdatePostFormData>({
        resolver: zodResolver(isEditing ? updatePostSchema : createPostSchema),
        defaultValues: {
            title: '',
            description: '',
            image: undefined,
        },
    });

    useEffect(() => {
        if (isEditing && editingPost) {
            form.reset({
                title: editingPost.title,
                description: editingPost.description,
                image: undefined,
            } as UpdatePostFormData);
            if (editingPost.image) {
                setImagePreviewUrl(`${API_BASE_URL}/${editingPost.image}`);
            } else {
                setImagePreviewUrl(null);
            }
        } else {
            form.reset({
                title: '',
                description: '',
            } as CreatePostFormData);
            setImagePreviewUrl(null);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        form.clearErrors();
    }, [isEditing, editingPost, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, fieldOnChange: (file: File | undefined) => void) => {        const file = e.target.files?.[0];
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
        form.trigger('image');
    };

    const clearImage = () => {
        form.setValue('image', null);
        setImagePreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        form.trigger('image');
    };

    const handleSubmit = async (data: CreatePostFormData | UpdatePostFormData) => {
        onSubmit(data, isEditing);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

                <FormField
                    control={form.control}
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
                    control={form.control}
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
                    control={form.control}
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
                                        <div className="relative inline-block h-32 w-32 mt-2">
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
                                                <X size={12} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {(createError || updateError) && (
                    <Alert variant="destructive">
                        <AlertDescription>
                            {createError || updateError}
                        </AlertDescription>
                    </Alert>
                )}
                <div className="flex justify-end space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
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
                </div>
            </form>
        </Form>
    );
};

export default PostForm;