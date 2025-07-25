"use client";

import { FileX, RefreshCw } from "lucide-react";
import { Button } from "./button";

interface Props {
    message?: string;
    onRetry?: () => void;
}

export default function EmptyState({ message = "Нет данных", onRetry }: Props) {
    return (
        <div className="flex flex-col items-center justify-center w-full py-12 text-muted-foreground">
            <FileX className="w-12 h-12 mb-4" />
            <p className="text-lg mb-4">{message}</p>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Обновить
                </Button>
            )}
        </div>
    );
}
