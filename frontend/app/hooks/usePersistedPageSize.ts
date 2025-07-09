import {useEffect, useState} from "react";

export const usePersistedPageSize = (
    storageKey: string,
    defaultSize: number = 10
) => {
    const [pageSize, setPageSize] = useState(() => {
        const saved = localStorage.getItem(storageKey);
        return saved ? parseInt(saved, 10) : defaultSize;
    });

    useEffect(() => {
        localStorage.setItem(storageKey, pageSize.toString());
    }, [pageSize, storageKey]);

    return [pageSize, setPageSize] as const;
};
