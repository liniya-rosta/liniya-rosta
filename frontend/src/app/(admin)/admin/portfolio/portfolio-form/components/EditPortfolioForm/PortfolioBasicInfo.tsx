import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import FormErrorMessage from "@/src/components/ui/FormErrorMessage";
import {PortfolioEditValues} from "@/src/lib/types";
import {Textarea} from "@/src/components/ui/textarea";

interface Props {
    register: UseFormRegister<PortfolioEditValues>;
    errors: FieldErrors<PortfolioEditValues>;
    updateLoading: boolean;
}

const PortfolioBasicInfo: React.FC<Props> = ({
                                                 register,
                                                 errors,
                                                 updateLoading,
                                             }) => (
    <div className="border-b border-gray-300 py-4 mb-6 space-y-4">
        <div className="space-y-1">
            <Label>Заголовок</Label>
            <Input {...register("title.ru")} disabled={updateLoading} />
            {errors.title?.ru && (
                <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>
            )}
        </div>

        <div className="space-y-1">
            <Label>SEO заголовок</Label>
            <Input {...register("seoTitle.ru")} disabled={updateLoading} />
            {errors.seoTitle?.ru && (
                <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>
            )}
        </div>

        <div  className="space-y-1">
            <Label>Описание</Label>
            <Textarea {...register("description.ru")} disabled={updateLoading} />
            {errors.description?.ru && (
                <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>
            )}
        </div>

        <div className="space-y-1">
            <Label>SEO описание</Label>
            <Textarea {...register("seoDescription.ru")} disabled={updateLoading} />
            {errors.seoDescription?.ru && (
                <FormErrorMessage>{errors.title.ru.message}</FormErrorMessage>
            )}
        </div>

        <div className="space-y-1">
            <Label className="block mb-2">Обложка</Label>
            <Input type="file" {...register("cover")} disabled={updateLoading} />
            {errors.cover && (
                <FormErrorMessage>{errors.cover.message}</FormErrorMessage>
            )}
        </div>

        <div className="space-y-1">
            <Label>Альтернативное название обложки</Label>
            <Input {...register("coverAlt.ru")} disabled={updateLoading} />
            {errors.coverAlt?.ru && (
                <FormErrorMessage>{errors.coverAlt.ru.message}</FormErrorMessage>
            )}
        </div>
    </div>
);

export default PortfolioBasicInfo;
