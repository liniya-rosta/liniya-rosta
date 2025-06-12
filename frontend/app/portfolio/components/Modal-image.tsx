import React, {useState} from 'react';
import {cn} from "@/lib/utils";
import {BtnClose} from "@/components/ui/btn-close";

interface Props {
    className?: string;
    isOpen: boolean;
    onClose?: () => void;
    handlePrev?: () => void;
    handleNext?: () => void;
}

export const ModalImage: React.FC<React.PropsWithChildren<Props>> = (
    {className, children, onClose, isOpen, handlePrev, handleNext }) => {
    const [showHint, setShowHint] = useState<boolean>(true);

    if (!isOpen) return null;

    return (
        <div
            onClick={onClose}
            className={cn('fixed inset-0 bg-black/50 flex items-center justify-center z-50', className)}
        >
            <div
                className="bg-white px-6 py-12 rounded-lg max-w-[90%] max-h-[90%] relative"
                onClick={(e) => e.stopPropagation()}
            >

                <BtnClose
                    onClick={onClose}
                    className="absolute top-2 right-2 font-bold text-black bg-transparent z-20"
                />

                <div className="relative max-w-[90vw] max-h-[90vh] mx-auto">
                    <div
                        onClick={handlePrev}
                        className="absolute inset-y-0 left-0 w-1/2 z-10 cursor-pointer group"
                    >
                    </div>
                    <div className="relative z-0">
                        {children}
                    </div>
                    <div
                        onClick={handleNext}
                        className="absolute inset-y-0 right-0 w-1/2 z-10 cursor-pointer group"
                    >
                    </div>
                </div>
                {showHint && (
                    <div
                        onClick={() => setShowHint(false)}
                        className="absolute bottom-[-3rem] left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-md shadow-md text-sm text-gray-700 cursor-pointer transition-opacity hover:opacity-80"
                    >
                        Для перелистывания изображений кликайте по левой или правой части картинки. (нажмите, чтобы скрыть)
                    </div>
                )}
            </div>
        </div>
    );
};