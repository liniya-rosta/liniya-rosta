import React from 'react';
import {cn} from "@/lib/utils";
import {BtnClose} from "@/components/ui/btn-close";

interface Props {
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
}

export const ModalWindow: React.FC<React.PropsWithChildren<Props>> = ({ className, children, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div
            className={cn('fixed inset-0 bg-black/50 flex items-center justify-center z-50', className)}
            onClick={onClose}
        >
            <div
                className="bg-white px-6 py-10 rounded-lg max-w-[90%] max-h-[90%] relative"
                onClick={(e) => e.stopPropagation()}
            >
                <BtnClose
                    onClick={onClose}
                    className="absolute top-2 right-2 font-bold text-black bg-transparent z-20"
                />
                {children}
            </div>
        </div>
    );
};