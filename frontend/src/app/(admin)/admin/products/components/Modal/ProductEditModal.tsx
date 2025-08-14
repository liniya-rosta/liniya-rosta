// "use client";
//
// import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/src/components/ui/dialog";
// import {Form, FormControl, FormField, FormItem, FormLabel,} from "@/src/components/ui/form";
// import {Input} from "@/src/components/ui/input";
// import {Textarea} from "@/src/components/ui/textarea";
// import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/src/components/ui/select";
// import {Button} from "@/src/components/ui/button";
// import {useFieldArray, useForm} from "react-hook-form";
// import {zodResolver} from "@hookform/resolvers/zod";
// import {Product} from "@/src/lib/types";
// import {useAdminProductStore} from "@/store/superadmin/superadminProductsStore";
// import React, {useRef, useState} from "react";
// import {updateProduct} from "@/actions/superadmin/products";
// import {toast} from "react-toastify";
// import {Trash2} from "lucide-react";
// import Image from "next/image";
// import {UpdateProductFormData, updateProductSchema} from "@/src/lib/zodSchemas/admin/productSchema";
// import {API_BASE_URL} from "@/src/lib/globalConstants";
// import {useAdminCategoryStore} from "@/store/superadmin/superadminCategoriesStore";
// import {handleKyError} from "@/src/lib/handleKyError";
//
// interface Props {
//     open: boolean;
//     onClose: () => void;
//     product: Product;
//     refresh: () => void;
// }
//
// const ProductEditModal: React.FC<Props> = ({open, onClose, product, refresh}) => {
//     const {categories} = useAdminCategoryStore();
//     const {
//         updateLoading,
//         setUpdateError,
//         products,
//         setProducts
//     } = useAdminProductStore();
//
//     const [coverPreview, setCoverPreview] = useState<string | null>(product.cover?.url ? `${API_BASE_URL}/${product.cover.url}` : null);
//     const [iconPreview, setIconPreview] = useState<string | null>(product.icon?.url ? `${API_BASE_URL}/${product.icon.url}` : null);
//
//     const form = useForm<UpdateProductFormData>({
//         resolver: zodResolver(updateProductSchema),
//         defaultValues: {
//             title: product.title,
//             category: product.category._id,
//             description: {
//                 ru: product.description?.ru ?? ""
//             },
//             seoTitle: {
//                 ru: product.seoTitle?.ru ?? ""
//             },
//             seoDescription: {
//                 ru: product.seoDescription?.ru ?? ""
//             },
//             coverAlt: {
//                 ru: product.cover?.alt?.ru ?? ""
//             },
//             iconAlt: {
//                 ru: product.icon?.alt?.ru ?? ""
//             },
//             sale: product.sale
//                 ? {
//                     isOnSale: product.sale.isOnSale,
//                     label: product.sale.label,
//                 }
//                 : {isOnSale: false, label: null},
//             characteristics: product.characteristics?.map(char => ({
//                 key: char.key ?? '',
//                 value: char.value ?? ''
//             })) || []
//         },
//     });
//
//     const {
//         fields: characteristicFields,
//         append: appendCharacteristic,
//         remove: removeCharacteristic
//     } = useFieldArray({control: form.control, name: "characteristics"});
//
//     const fileInputCoverRef = useRef<HTMLInputElement>(null);
//     const fileInputIconRef = useRef<HTMLInputElement>(null);
//
//     const onCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         form.setValue("cover", file);
//         setCoverPreview(URL.createObjectURL(file));
//     };
//
//     const onIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const file = e.target.files?.[0];
//         if (!file) return;
//         form.setValue("icon", file);
//         setIconPreview(URL.createObjectURL(file));
//     };
//
//     const onSubmit = async (data: UpdateProductFormData) => {
//         try {
//             setUpdateError(null);
//             const updated = await updateProduct(product._id, data);
//             setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
//             refresh();
//             toast.success("Продукт успешно обновлён");
//             onClose();
//         } catch (e) {
//             const msg = await handleKyError(e, "Ошибка при обновлении продукта");
//             toast.error(msg);
//             console.error(msg);
//         }
//     };
//
//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogHeader>
//                 <DialogTitle>Редактировать продукт</DialogTitle>
//                 <DialogDescription>
//                     {"Измените данные продукта и нажмите \"Сохранить\""}
//                 </DialogDescription>
//             </DialogHeader>
//
//             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                 <DialogHeader>
//                     <DialogTitle>Редактировать продукт</DialogTitle>
//                 </DialogHeader>
//
//                 <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="title.ru"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Название</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Название продукта"
//                                                    disabled={updateLoading} {...field} />
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="category"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Категория</FormLabel>
//                                         <Select
//                                             onValueChange={field.onChange}
//                                             value={field.value}
//                                             disabled={updateLoading}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger className="w-full cursor-pointer">
//                                                     <SelectValue placeholder="Выберите категорию"/>
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {categories.map((cat) => (
//                                                     <SelectItem key={cat._id} value={cat._id}>
//                                                         {cat.title.ru}
//                                                     </SelectItem>
//                                                 ))}
//                                             </SelectContent>
//                                         </Select>
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//
//                         <FormField
//                             control={form.control}
//                             name="description.ru"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>Описание</FormLabel>
//                                     <FormControl>
//                                         <Textarea rows={3} placeholder="Описание продукта"
//                                                   disabled={updateLoading} {...field} />
//                                     </FormControl>
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="seoTitle.ru"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>SEO Заголовок</FormLabel>
//                                     <FormControl>
//                                         <Input
//                                             placeholder="SEO заголовок"
//                                             disabled={updateLoading}
//                                             {...field}
//                                             value={field.value ?? ""}
//                                         />
//                                     </FormControl>
//                                 </FormItem>
//                             )}
//                         />
//
//                         <FormField
//                             control={form.control}
//                             name="seoDescription.ru"
//                             render={({field}) => (
//                                 <FormItem>
//                                     <FormLabel>SEO Описание</FormLabel>
//                                     <FormControl>
//                                         <Textarea
//                                             placeholder="SEO описание"
//                                             rows={2}
//                                             disabled={updateLoading}
//                                             {...field}
//                                             value={field.value ?? ""}
//                                         />
//                                     </FormControl>
//                                 </FormItem>
//                             )}
//                         />
//
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
//                             <FormField
//                                 control={form.control}
//                                 name="cover"
//                                 render={() => (
//                                     <FormItem>
//                                         <FormLabel>Обложка</FormLabel>
//                                         <FormControl>
//                                             <div>
//                                                 <Button type="button" variant="outline"
//                                                         onClick={() => fileInputCoverRef.current?.click()}>
//                                                     {coverPreview ? "Изменить обложку" : "Загрузить обложку"}
//                                                 </Button>
//                                                 <Input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     ref={fileInputCoverRef}
//                                                     onChange={onCoverChange}
//                                                     className="hidden"
//                                                 />
//                                             </div>
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="coverAlt.ru"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Alt текст обложки</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Описание" {...field} value={field.value ?? ""}/>
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             {coverPreview && (
//                                 <Image
//                                     src={coverPreview}
//                                     alt="предпросмотр"
//                                     width={128}
//                                     height={128}
//                                     className="rounded border object-cover mt-2"
//                                 />
//                             )}
//                         </div>
//
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
//                             <FormField
//                                 control={form.control}
//                                 name="icon"
//                                 render={() => (
//                                     <FormItem>
//                                         <FormLabel>Иконка</FormLabel>
//                                         <FormControl>
//                                             <div>
//                                                 <Button type="button" variant="outline"
//                                                         onClick={() => fileInputIconRef.current?.click()}>
//                                                     {iconPreview ? "Изменить иконку" : "Загрузить иконку"}
//                                                 </Button>
//                                                 <Input
//                                                     type="file"
//                                                     accept="image/*"
//                                                     ref={fileInputIconRef}
//                                                     onChange={onIconChange}
//                                                     className="hidden"
//                                                 />
//                                             </div>
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="iconAlt.ru"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Alt текст иконки</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Описание иконки" disabled={updateLoading} {...field}
//                                                    value={field.value ?? ""}/>
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             {iconPreview && (
//                                 <Image
//                                     src={iconPreview}
//                                     alt="предпросмотр"
//                                     width={64}
//                                     height={64}
//                                     className="rounded border object-cover mt-2"
//                                 />
//                             )}
//                         </div>
//
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <FormField
//                                 control={form.control}
//                                 name="sale.isOnSale"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Товар по акции?</FormLabel>
//                                         <Select
//                                             onValueChange={(val) => field.onChange(val === "true")}
//                                             value={field.value ? "true" : "false"}
//                                             disabled={updateLoading}
//                                         >
//                                             <FormControl>
//                                                 <SelectTrigger className="w-full cursor-pointer">
//                                                     <SelectValue placeholder="Акционный товар?"/>
//                                                 </SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 <SelectItem value="true">Да</SelectItem>
//                                                 <SelectItem value="false">Нет</SelectItem>
//                                             </SelectContent>
//                                         </Select>
//                                     </FormItem>
//                                 )}
//                             />
//                             <FormField
//                                 control={form.control}
//                                 name="sale.label"
//                                 render={({field}) => (
//                                     <FormItem>
//                                         <FormLabel>Текст акции</FormLabel>
//                                         <FormControl>
//                                             <Input placeholder="Например: -20%" disabled={updateLoading} {...field}
//                                                    value={field.value ?? ""}/>
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                         </div>
//
//                         <div className="space-y-4">
//                             <Button
//                                 type="button"
//                                 onClick={() => appendCharacteristic({key: {ru: ""}, value: {ru: ""}})}
//                                 disabled={updateLoading}
//                             >
//                                 Добавить характеристику
//                             </Button>
//
//                             {characteristicFields.map((item, index) => (
//                                 <div key={item.id} className="grid grid-cols-9 gap-4 items-end">
//                                     <FormField
//                                         control={form.control}
//                                         name={`characteristics.${index}.key.ru`}
//                                         render={({field}) => (
//                                             <FormItem className="col-span-4">
//                                                 <FormControl>
//                                                     <Input placeholder="Ключ" disabled={updateLoading} {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <FormField
//                                         control={form.control}
//                                         name={`characteristics.${index}.value.ru`}
//                                         render={({field}) => (
//                                             <FormItem className="col-span-4">
//                                                 <FormControl>
//                                                     <Input placeholder="Значение" disabled={updateLoading} {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//                                     <div className="col-span-1">
//                                         <Button
//                                             type="button"
//                                             variant="destructive"
//                                             size="icon"
//                                             onClick={() => removeCharacteristic(index)}
//                                             disabled={updateLoading}
//                                         >
//                                             <Trash2 className="w-4 h-4"/>
//                                         </Button>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//
//                         <div className="flex justify-end gap-2 pt-6">
//                             <Button type="button" variant="outline" onClick={onClose}>
//                                 Отмена
//                             </Button>
//                             <Button type="submit" disabled={updateLoading}>
//                                 Сохранить
//                             </Button>
//                         </div>
//                     </form>
//                 </Form>
//             </DialogContent>
//         </Dialog>
//     );
// };
//
// export default ProductEditModal;