import React from "react";
import {Button} from "@/src/components/ui/button";
import {BtnArrow} from "@/src/components/ui/btn-arrow";

interface Props {
    page: number;
    totalPages: number;
    paginationButtons: (number | string)[];
    onPageChange: (newPage: number) => void;
}

const PaginationButtons: React.FC<Props> = ({page, totalPages, paginationButtons, onPageChange}) => {
    return (
        <div className="flex justify-center mt-6 mb-25 gap-4">
            <BtnArrow
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                isLeft
                className="bg-muted text-foreground hover:bg-muted-foreground/10"
                classNameIcon="text-primary"
            />
            {paginationButtons.map((btn, index) =>
                typeof btn === "number" ? (
                    <Button
                        key={btn}
                        onClick={() => onPageChange(btn)}
                        className={`px-3 py-1 rounded-md border text-sm font-medium ${
                            page === btn
                                ? "bg-primary text-white"
                                : "bg-muted text-foreground hover:bg-muted-foreground/10"
                        }`}
                        aria-current={page === btn ? "page" : undefined}
                    >
                        {btn}
                    </Button>
                ) : (
                    <span key={"dots-" + index} className="px-3 py-1 select-none">
                        {btn}
                    </span>
                )
            )}
            <BtnArrow
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className="bg-muted text-foreground hover:bg-muted-foreground/10"
                classNameIcon="text-primary"
            />
        </div>
    );
};

export default PaginationButtons;