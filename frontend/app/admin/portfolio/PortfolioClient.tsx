'use client'

import {PortfolioItemDetail, PortfolioItemPreview} from "@/lib/types";
import {
    ColumnFiltersState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import React, {useState} from "react";
import {getColumns} from "@/app/admin/portfolio/components/dataTable/Columns";
import CustomTable from "@/app/admin/portfolio/components/dataTable/Table";
import ModalCover from "@/app/admin/portfolio/components/ModalCover";
import CustomTableHeader from "@/app/admin/portfolio/components/dataTable/TableHeader";
import CustomTableFooter from "@/app/admin/portfolio/components/dataTable/TableFooter";

interface Props {
    data: PortfolioItemPreview[];
}

const AdminPortfolioClient: React.FC<Props> = ({data}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<PortfolioItemDetail | null>(null);

    const table = useReactTable<PortfolioItemPreview>({
        data,
        columns: getColumns((image) => {
            setSelectedImage(image);
            setIsModalOpen(true);
        }),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div>
           <CustomTableHeader table={table}/>

            <div className="rounded-md border">
                <CustomTable table={table}/>
            </div>

            <CustomTableFooter table={table}/>

            <ModalCover
                open={isModalOpen}
                openChange={() => setIsModalOpen(!isModalOpen)}
                selectedImage={selectedImage}
            />
        </div>
    )
}

export default AdminPortfolioClient;