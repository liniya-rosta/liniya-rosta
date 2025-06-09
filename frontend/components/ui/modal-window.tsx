import React from 'react';
import {cn} from "@/lib/utils";

interface Props {
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
}

export const ModalWindow: React.FC<React.PropsWithChildren<Props>> = ({ className, children, onClose, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className={cn('fixed inset-0 bg-black/50 flex items-center justify-center z-50', className)}>
            <div className="bg-white px-6 py-10 rounded-lg max-w-[90%] max-h-[90%] relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 font-bold text-3xl"
                >
                    ×
                </button>
                {children}
            </div>
        </div>
    );
};