import React from 'react';
import {UseFormReturn} from "react-hook-form";
import {CreateProductFormData} from "@/src/lib/zodSchemas/admin/productSchema";
import ProductImages
    from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductImagesCharacteristics/ProductImages";
import ProductCharacteristics
    from "@/src/app/(admin)/admin/products/add-product/components/ProductForm/fields/ProductImagesCharacteristics/ProductCharacteristics";

interface Props {
    form: UseFormReturn<CreateProductFormData>;
}

const ProductImagesCharacteristics: React.FC<Props> = ({form}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 border-t border-t-gray-500 pt-10">
            <ProductImages form={form}/>
            <ProductCharacteristics form={form}/>
        </div>
    );
};

export default ProductImagesCharacteristics;