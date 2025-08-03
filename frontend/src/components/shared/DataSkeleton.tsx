import React from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/src/components/ui/table";
import { Skeleton } from "@/src/components/ui/skeleton";

const DataSkeleton= () => {
    return (
        <>
            <div className="flex justify-between gap-4 py-4 flex-wrap items-center">
                <Skeleton className="w-full max-w-2xl min-w-[300px] h-10" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-20" />
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <TableHead key={i}>
                                <Skeleton className="h-4 w-24" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 10 }).map((_, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {Array.from({ length: 4 }).map((_, cellIdx) => (
                                <TableCell key={cellIdx}>
                                    <Skeleton className="h-10 w-full" />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
            </div>
        </>
    )
}

export default DataSkeleton;