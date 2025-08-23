import AdminPortfolioClient from "@/src/app/(admin)/admin/portfolio/PortfolioClient";
import Link from "next/link";
import {Button} from "@/src/components/ui/button";
import {Plus} from "lucide-react";
import React from "react";

const AdminPortfolioPage = () => {
    return (
        <>
            <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 mb-4">
                <div>
                    <h1 className="text-23-30-1_5 font-bold text-center md:text-left">
                        Управление портфолио
                    </h1>
                    <p className="text-muted-foreground mt-1 text-center md:text-left">
                        Создавайте и редактируйте портфолио
                    </p>
                </div>
                <Link href="/admin/portfolio/portfolio-form" >
                    <Button className="flex items-center gap-2 w-full sm:w-auto btn-hover-scale">
                        <Plus size={16} />
                        Создать портфолио
                    </Button>
                </Link>
            </div>
            <AdminPortfolioClient />
        </>

    )
};

export default AdminPortfolioPage;