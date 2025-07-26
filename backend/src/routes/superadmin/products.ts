import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";
import mongoose, {Types} from "mongoose";
import {productImage} from "../../middleware/multer";
import {deleteOrReplaceImages} from "../../middleware/deleteImages/deleteImages";
import {deleteOrReplaceSubImage} from "../../middleware/deleteImages/deleteImagesGallery";
import {deleteOrReplaceIconImage} from "../../middleware/deleteImages/deleteImagesIcons";
import slugify from "slugify";
import {translateYandex} from "../../../translateYandex";

const productsSuperAdminRouter = express.Router();

productsSuperAdminRouter.post("/", productImage.fields([
    {name: "cover", maxCount: 1},
    {name: "images"},
    {name: "icon", maxCount: 1}
]), async (req, res, next) => {
    try {
        const files = req.files as {
            [fieldName: string]: Express.Multer.File[];
        };

        const coverFile = files.cover?.[0];
        const imagesFiles = files.images || [];
        const iconFile = files.icon?.[0];

        const {category, title, description, seoTitle, seoDescription} = req.body;
        if (!category || !title || !title.trim() || !coverFile) {
            res.status(400).send({error: "Категория, заголовок и обложка обязательны"});
            return;
        }

        if (!mongoose.Types.ObjectId.isValid(category)) {
            res.status(400).send({error: "Неверный формат ID категории"});
            return;
        }

        const categoryExists = await Category.findById(category);
        if (!categoryExists) {
            res.status(400).send({error: "Указанная категория не существует"});
            return;
        }

        const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];
        const altsKy = await Promise.all(alts.map(alt => translateYandex(alt, "ky")));


        const images = imagesFiles.map((file, i) => ({
            url: "products/" + file.filename,
            alt: {
                ru: alts[i],
                ky: altsKy[i]
            },
        }));

        let parsedCharacteristics = [];

        if (req.body.characteristics) {
            const original = JSON.parse(req.body.characteristics);
            parsedCharacteristics = await Promise.all(
                original.map(async (char: {name: string; value: string}) => ({
                    name: {
                        ru: char.name,
                        ky: await translateYandex(char.name, "ky")
                    },
                    value: {
                        ru: char.value,
                        ky: await translateYandex(char.value, "ky")
                    }
                }))
            );
        }

        const titleKy = await translateYandex(title, "ky");
        const desKy = await translateYandex(description, "ky");
        const coverAltKy = await translateYandex(req.body.coverAlt, "ky")
        const labelKy = await translateYandex(req.body.label, "ky");
        const iconAltKy = await translateYandex(req.body.icon, "ky");

        const product = new Product({
            category,
            title: {ru: title.trim(), ky: titleKy},
            seoTitle: seoTitle?.trim() || null,
            seoDescription: seoDescription?.trim() || null,
            description: {ru: description?.trim(), ky: desKy},
            cover: {
                url: `products/${coverFile.filename}`,
                alt: {ru: req.body.coverAlt, ky: coverAltKy},
            },
            images,
            characteristics: parsedCharacteristics,
            sale: {
                isOnSale: req.body.isOnSale === 'true',
                label: {ru: req.body.label, ky: labelKy},
            },
            icon: {
                url: iconFile ? `products/${iconFile.filename}` : null,
                alt: {ru: req.body.iconAlt, ky: iconAltKy},
            },
        });

        await product.save();
        res.send({message: "Продукт создан успешно", product});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.patch(
    "/:id",
    productImage.fields([
        {name: "cover", maxCount: 1},
        {name: "images"},
        {name: "icon", maxCount: 1}
    ]),

    deleteOrReplaceImages(
        Product,
        (doc) => doc.cover?.url ? [doc.cover.url] : [],
        (req) => {
            const files = req.files as Record<string, Express.Multer.File[]>;
            const result: string[] = [];
            if (files.cover?.[0]) {
                result.push(`products/${files.cover[0].filename}`);
            }
            return result;
        },
        "replace"
    ),

    deleteOrReplaceIconImage(Product, {
        path: "icon",
        key: "url",
        mode: "replace",
    }),

    async (req, res, next) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const coverFile = files.cover?.[0];
        const imagesFiles = files.images || [];
        const iconFile = files.icon?.[0];

        const {id} = req.params;
        const {category, title, description, seoTitle, seoDescription} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID продукта"});
            return;
        }

        const product = await Product.findById(id);
        if (!product) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                res.status(400).send({error: "Неверный формат ID категории"});
                return;
            }

            const categoryExists = await Category.findById(category);
            if (!categoryExists) {
                res.status(400).send({error: "Указанная категория не существует"});
                return;
            }

            product.category = category;
        }

        if (title) {
            const titleKy = await translateYandex(title, "ky");
            product.title = {ru: title.trim(), ky: titleKy};

            const baseSlug = slugify(title, {lower: true, strict: true});
            let uniqueSlug = baseSlug;
            let counter = 1;

            while (await Product.exists({slug: uniqueSlug, _id: {$ne: product._id}})) {
                uniqueSlug = `${baseSlug}-${counter}`;
                counter++;
            }

            product.slug = uniqueSlug;
        }

        if (seoTitle !== undefined) {
            product.seoTitle = seoTitle?.trim() || null;
        }

        if (seoDescription !== undefined) {
            product.seoDescription = seoDescription?.trim() || null;
        }

        if (description) {
            const desKy = await translateYandex(description, "ky");
            product.description = {ru: description.trim(), ky: desKy};
        }

        if (req.body.characteristics) {
            try {
                const original = JSON.parse(req.body.characteristics);
                const translatedChars = await Promise.all(
                    original.map(async (char: {name: string; value: string}) => ({
                        name: {
                            ru: char.name,
                            ky: await translateYandex(char.name, "ky")
                        },
                        value: {
                            ru: char.value,
                            ky: await translateYandex(char.value, "ky")
                        }
                    }))
                );

                product.set('characteristics', translatedChars);
            } catch {
                res.status(400).send({error: "Некорректный формат characteristics"});
                return;
            }
        }

        if (req.body.images) {
            try {
                const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];
                const altsKy = await Promise.all(alts.map((alt) => translateYandex(alt, "ky")));

                const images = JSON.parse(req.body.images);
                product.images = images.map((img: any, i: number) => ({
                    url: img.url,
                    alt: {
                        ru: alts[i] || '',
                        ky: altsKy[i] || '',
                    },
                }));
            } catch {
                res.status(400).send({error: "Некорректный формат images"});
                return;
            }
        }

        if (req.body.characteristics) {
            try {
                product.characteristics = JSON.parse(req.body.characteristics);
            } catch {
                res.status(400).send({error: "Некорректный формат characteristics"});
                return;
            }
        }

        if (imagesFiles.length > 0) {
            const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];

            product.set('images', imagesFiles.map((file, i) => ({
                url: "products/" + file.filename,
                alt: alts[i] || null,
            })));
        }

        if (!product.sale) {
            product.sale = {isOnSale: false, label: {ru: '', ky: ''}};
        }

        if (req.body.isOnSale !== undefined) {
            product.sale.isOnSale = req.body.isOnSale === 'true';
        }

        if (req.body.saleLabel !== undefined) {
            const labelKy = await translateYandex(req.body.saleLabel || '', "ky");
            product.sale.label = {
                ru: req.body.saleLabel || '',
                ky: labelKy
            };
        }

        if (iconFile) {
            const iconAltRu = req.body.iconAlt || '';
            const iconAltKy = await translateYandex(iconAltRu, "ky");

            product.icon = {
                url: `products/${iconFile.filename}`,
                alt: {
                    ru: iconAltRu,
                    ky: iconAltKy
                },
            };
        }

        if (coverFile) {
            const coverAltRu = req.body.coverAlt || '';
            const coverAltKy = await translateYandex(coverAltRu, "ky");

            product.cover = {
                url: `products/${coverFile.filename}`,
                alt: {
                    ru: coverAltRu,
                    ky: coverAltKy
                },
            };
        }

        await product.save();
        const updatedProduct = await Product.findById(product._id).populate("category");
        res.send({message: "Продукт обновлен успешно", product: updatedProduct});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.patch(
    "/images/:imageId",
    productImage.single("image"),
    deleteOrReplaceSubImage(Product, {
        path: "images",
        key: "url",
        mode: "replace",
    }),
    async (req, res, next) => {
        try {
            const {imageId} = req.params;
            const file = req.file;
            const newAlt = req.body?.alt;

            if (!Types.ObjectId.isValid(imageId)) {
                res.status(400).send({error: "Неверный ID изображения"});
                return;
            }

            const updateFields: Record<string, unknown> = {};
            if (file) updateFields["images.$.url"] = "products/" + file.filename;
            if (newAlt) updateFields["images.$.alt"] = newAlt;

            const result = await Product.updateOne(
                {"images._id": imageId},
                {$set: updateFields}
            );

            if (result.modifiedCount === 0) {
                res.status(404).send({error: "Изображение не найдено или не обновлено"});
                return;
            }

            const updatedProduct = await Product.findOne({"images._id": imageId});
            res.send(updatedProduct);
        } catch (e) {
            next(e);
        }
    }
);
productsSuperAdminRouter.delete(
    "/:id",
    deleteOrReplaceImages(
        Product,
        (doc) => {
            const urls: string[] = [];

            if (doc.cover?.url) urls.push(doc.cover.url);
            if (doc.images?.length) urls.push(...doc.images.map((i) => i.url));
            if (doc.icon?.url) urls.push(doc.icon.url);

            return urls;
        }
    ),
    async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).send({error: "Неверный формат ID продукта"});
            return;
        }

        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).send({error: "Продукт не найден"});
            return;
        }
        res.send({message: "Продукт успешно удален"});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.delete(
    "/images/:imageId",
    deleteOrReplaceSubImage(Product, {
        path: "images",
        key: "url",
        mode: "delete",
    }),
    async (req, res, next) => {
        try {
            const {imageId} = req.params;
            if (!Types.ObjectId.isValid(imageId)) {
                res.status(400).send({error: "Неверный ID изображения"});
                return;
            }

            const result = await Product.updateOne(
                {"images._id": imageId},
                {$pull: {images: {_id: imageId}}}
            );

            if (result.modifiedCount === 0) {
                res.status(404).send({error: "Изображение не найдено или уже удалено"});
                return;
            }

            res.send({message: "Изображение успешно удалено"});
        } catch (e) {
            next(e);
        }
    }
);


export default productsSuperAdminRouter;