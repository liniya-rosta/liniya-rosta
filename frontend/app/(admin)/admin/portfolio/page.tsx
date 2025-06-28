import AdminPortfolioClient from "@/app/(admin)/admin/portfolio/PortfolioClient";

const AdminPortfolioPage = async () => {
    const limit = "10";

    return (
        <>
            <AdminPortfolioClient limit={limit}/>
        </>
    )
};

export default AdminPortfolioPage;