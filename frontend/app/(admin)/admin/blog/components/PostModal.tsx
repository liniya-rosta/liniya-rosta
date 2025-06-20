import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {CreatePostData, Post, UpdatePostData} from '@/lib/types';
import PostForm from './PostForm';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEditing: boolean;
    editingPost: Post | null;
    actionLoading: boolean;
    createError: string | null;
    updateError: string | null;
    onSubmit: (formData: CreatePostData | UpdatePostData, isEditingMode: boolean) => void;
}

const PostModal: React.FC<PostModalProps> = ({isOpen, onClose, isEditing, editingPost, actionLoading, createError, updateError, onSubmit,}) => {
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

                <PostForm
                    isEditing={isEditing}
                    editingPost={editingPost}
                    actionLoading={actionLoading}
                    createError={createError}
                    updateError={updateError}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                />
            </DialogContent>
        </Dialog>
    );
};

export default PostModal;