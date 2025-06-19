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
import React, {useEffect, useState} from "react";
import {getColumns} from "@/app/(admin)/admin/portfolio/components/dataTable/Columns";
import CustomTable from "@/app/(admin)/admin/portfolio/components/dataTable/Table";
import ModalCover from "@/app/(admin)/admin/portfolio/components/ModalCover";
import CustomTableHeader from "@/app/(admin)/admin/portfolio/components/dataTable/TableHeader";
import CustomTableFooter from "@/app/(admin)/admin/portfolio/components/dataTable/TableFooter";
import {
    deleteGalleryItemSuperAdmin,
    deletePortfolioSuperAdmin, fetchGalleryItem,
    fetchPortfolioItems,
    fetchPortfolioPreviews
} from "@/actions/portfolios";
import ModalEdit from "@/app/(admin)/admin/portfolio/components/ModelEdit/ModalEdit";
import PortfolioItemForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/PortfolioItemForm";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import ModalGallery from "@/app/(admin)/admin/portfolio/components/ModalGallery";
import GalleryForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/GalleryForm";

interface Props {
    data: PortfolioItemPreview[];
}

const AdminPortfolioClient: React.FC<Props> = ({data}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    const [isModalOpenCover, setIsModalOpenCover] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [isModalOpenGallery, setIsModalOpenGallery] = useState(false);

    const [selectedCover, setSelectedCover] = useState<PortfolioItemDetail | null>(null);
    const [isGalleryEdit, setGalleryEdit] = useState<boolean>(false);

    const {
        gallery,
        items,
        setPortfolioItemDetail,
        setGallery,
        setGalleryItem,
        setPortfolioPreview
    } = useSuperAdminPortfolioStore();

    useEffect(() => {
        setPortfolioPreview(data);
    }, [data, setPortfolioPreview]);

    const onDeletePortfolio = async (id: string) => {
        try {
            await deletePortfolioSuperAdmin(id);
            await fetchPortfolioPreviews();
        } catch (e) {
            console.error(e);
        }
    };

    const onDeleteGalleryItem = async (gallery_id: string) => {
        try {
            await deleteGalleryItemSuperAdmin(gallery_id)
        } catch (e) {
            console.error(e);
        }
    }

    const openEditModalCover = async (id: string) => {
        const portfolioItem = await fetchPortfolioItems(id);
        setIsModalOpenEdit(true);
        setGalleryEdit(false);
        setPortfolioItemDetail(portfolioItem)
    };

    const openGalleryModal = async (id: string) => {
        const portfolioItem = await fetchPortfolioItems(id);
        setIsModalOpenGallery(true);
        setGallery(portfolioItem.gallery);
    }
    const handleEditGalleryItem = async (id: string) => {
        const galleryItem = await fetchGalleryItem(id)
        setGalleryItem(galleryItem);
        setGalleryEdit(true);
        setIsModalOpenEdit(true);
    };


    const table = useReactTable<PortfolioItemPreview>({
        data: items,
        columns: getColumns(
            (image) => {
                setSelectedCover(image);
                setIsModalOpenCover(true);
            },
            onDeletePortfolio,
            openEditModalCover,
            openGalleryModal,
        ),
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

            {selectedCover &&
                <ModalCover
                    open={isModalOpenCover}
                    openChange={() => setIsModalOpenCover(!isModalOpenCover)}
                    alt={selectedCover.coverAlt}
                    image={selectedCover.cover}
                />
            }


            <ModalEdit
                open={isModalOpenEdit}
                openChange={() => setIsModalOpenEdit(!isModalOpenEdit)}>
                {isGalleryEdit ?
                    <GalleryForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
                    : <PortfolioItemForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
                }
            </ModalEdit>

            <ModalGallery
                open={isModalOpenGallery}
                openChange={() => setIsModalOpenGallery(!isModalOpenGallery)}
                gallery={gallery}
                isOpenModalEdit={handleEditGalleryItem}
                onDeleteGalleryItem={onDeleteGalleryItem}
            />
        </div>
    )
}

export default AdminPortfolioClient;