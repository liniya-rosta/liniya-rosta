import ProductCreateForm from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/ProductCreateForm";
import {Category} from "@/src/lib/types";
import {fetchCategories} from "@/actions/categories";
import {handleKyError} from "@/src/lib/handleKyError";

const AddProduct = async () => {
    let categories: Category[] = [];
    let categoriesError: string | null = null;

    try {
        categories = await fetchCategories();
    } catch (e) {
        const msg = await handleKyError(e, 'Неизвестная ошибка при загрузке категорий');
        categoriesError = msg;
        console.error(msg);
    }

    return (
        <div className="container mx-auto px-4">
            <h2 className="font-bold text-3xl mb-5">Создать продукт</h2>
            <ProductCreateForm initialCategories={categories} initialCategoriesError={categoriesError}/>
        </div>
    )
};

export default AddProduct;