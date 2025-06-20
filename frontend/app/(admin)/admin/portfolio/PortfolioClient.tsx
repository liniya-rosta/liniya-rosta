'use client'

import {PortfolioItemPreview} from "@/lib/types";
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
import {getColumns} from "@/app/(admin)/admin/portfolio/components/DataTable/Columns";
import CustomTable from "@/app/(admin)/admin/portfolio/components/DataTable/Table";
import ModalCover from "@/app/(admin)/admin/portfolio/components/ModalCover";
import CustomTableHeader from "@/app/(admin)/admin/portfolio/components/DataTable/TableHeader";
import CustomTableFooter from "@/app/(admin)/admin/portfolio/components/DataTable/TableFooter";
import {fetchGalleryItem,
    fetchPortfolioItems,
    fetchPortfolioPreviews
} from "@/actions/portfolios";
import ModalEdit from "@/app/(admin)/admin/portfolio/components/ModelEdit/ModalEdit";
import {useSuperAdminPortfolioStore} from "@/store/superadmin/superAdminPortfolio";
import ModalGallery from "@/app/(admin)/admin/portfolio/components/ModalGallery";
import {deleteGalleryItem, deletePortfolio } from "@/actions/superadmin/portfolios";
import DataSkeleton from "@/components/shared/DataSkeleton";
import PortfolioEditForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/PortfolioEditForm";
import GalleryEditForm from "@/app/(admin)/admin/portfolio/components/ModelEdit/GalleryEditForm";

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

    const [selectedCover, setSelectedCover] = useState<{ cover: string; alt: string } | null>(null);
    const [isGalleryEdit, setGalleryEdit] = useState<boolean>(false);

    const {
        gallery,
        items,
        fetchPortfolioLoading,
        deleteLoading,
        setPortfolioItemDetail,
        setGallery,
        setGalleryItem,
        setPortfolioPreview,
        setPortfolioFetchLoading,
        setPortfolioDeleteLoading
    } = useSuperAdminPortfolioStore();

    useEffect(() => {
        setPortfolioPreview(data);
        setPortfolioFetchLoading(false);
    }, [data, setPortfolioPreview, setPortfolioFetchLoading]);

    const onDeletePortfolio = async (id: string) => {
        try {
            await deletePortfolio(id);
            await fetchPortfolioPreviews();
            setPortfolioDeleteLoading(true)
        } catch (e) {
            console.error(e);
        } finally {
            setPortfolioDeleteLoading(false)
        }
    };

    const onDeleteGalleryItem = async (gallery_id: string) => {
        try {
            await deleteGalleryItem(gallery_id)
        } catch (e) {
            console.error(e);
        } finally {

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

    if (fetchPortfolioLoading) return <DataSkeleton/>

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
                    alt={selectedCover.alt}
                    image={selectedCover.cover}
                />
            }

            <ModalEdit
                open={isModalOpenEdit}
                openChange={() => setIsModalOpenEdit(!isModalOpenEdit)}>
                {isGalleryEdit ?
                    <GalleryEditForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
                    : <PortfolioEditForm onSaved={()=> setIsModalOpenEdit(!isModalOpenEdit)}/>
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