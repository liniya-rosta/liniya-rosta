import {Dialog, DialogContent} from "@/components/ui/dialog";
import {DialogTitle} from "@radix-ui/react-dialog";
import {API_BASE_URL} from "@/lib/globalConstants";
import Image from "next/image";
import React from "react";
import {PortfolioItemDetail} from "@/lib/types";

interface Props {
    open: boolean;
    openChange: () => void,
    selectedImage: PortfolioItemDetail | null,
}

const ModalCover: React.FC<Props> = ({open, openChange, selectedImage}) => {
    return (
        <Dialog open={open} onOpenChange={openChange}>
            <DialogContent>
                {selectedImage && (
                    <>
                        <DialogTitle>{selectedImage.coverAlt}</DialogTitle>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`${API_BASE_URL}/${selectedImage.cover}`}
                            onClick={(e) => e.preventDefault()}
                            className="block max-w-[90vw] max-h-[90vh] w-auto h-auto cursor-default"
                        >
                            <Image
                                src={`${API_BASE_URL}/${selectedImage.cover}`}
                                alt={selectedImage.coverAlt}
                                width={800}
                                height={600}
                                className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                            />
                        </a>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ModalCover;