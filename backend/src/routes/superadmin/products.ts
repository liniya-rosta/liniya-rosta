import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";
import mongoose from "mongoose";
import {productImage} from "../../middleware/multer";
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

        const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : (req.body.alt ? [req.body.alt] : []);
        const altsKy = await Promise.all(alts.map(alt => translateYandex(alt, "ky")));


        const images = imagesFiles.map((file, i) => ({
            image: "product/" + file.filename,
            alt: {
                ru: alts[i],
                ky: altsKy[i]
            },
        }));

        let parsedCharacteristics = [];

        if (req.body.characteristics) {
            const original = JSON.parse(req.body.characteristics);
            parsedCharacteristics = await Promise.all(
                original.map(async (char: {key: {ru: string}; value: { ru: string }}) => ({
                    key: {
                        ru: char.key.ru,
                        ky: await translateYandex(char.key.ru, "ky")
                    },
                    value: {
                        ru: char.value.ru,
                        ky: await translateYandex(char.value.ru, "ky")
                    }
                }))
            );
        }

        const titleKy = await translateYandex(title, "ky");
        const desKy = await translateYandex(description, "ky");
        const coverAltKy = await translateYandex(req.body.coverAlt, "ky")
        const iconAltKy = await translateYandex(req.body.iconAlt, "ky");

        let descriptionField = null;
        if (description?.trim()) {
            descriptionField = {
                ru: description.trim(),
                ky: desKy,
            };
        }

        const product = new Product({
            category,
            title: {ru: title.trim(), ky: titleKy},
            seoTitle: {
                ru: seoTitle?.trim() || null,
                ky: await translateYandex(seoTitle?.trim() || "", "ky")
            },
            seoDescription: {
                ru: seoDescription?.trim() || null,
                ky: await translateYandex(seoDescription?.trim() || "", "ky")
            },
            description: descriptionField,
            cover: {
                url: `product/${coverFile.filename}`,
                alt: {ru: req.body.coverAlt, ky: coverAltKy},
            },
            images,
            characteristics: parsedCharacteristics,
            sale: {
                isOnSale: req.body.isOnSale === 'true',
                label: req.body.saleLabel,
            },
            icon: iconFile ? {
                url: `product/${iconFile.filename}`,
                alt: {ru: req.body.iconAlt, ky: iconAltKy},
            } : null,
        });

        await product.save();
        res.send({message: "Продукт создан успешно", product});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.post(
    "/:id/images",
    productImage.array("images", 20),
    async (req, res, next) => {
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).send({error: "Неверный формат ID продукта"});
                return;
            }

            const product = await Product.findById(id);
            if (!product) {
                res.status(404).send({error: "Продукт не найден"});
                return;
            }

            const imagesFiles = (req.files as Express.Multer.File[]) || [];
            if (!Array.isArray(imagesFiles) || imagesFiles.length === 0) {
                res.status(400).send({error: "Файлы изображений не получены"});
                return;
            }

            const alts: string[] = Array.isArray(req.body.alt)
                ? req.body.alt
                : (req.body.alt ? [req.body.alt] : []);

            const altsKy = await Promise.all(
                alts.map((alt) => translateYandex(alt || "", "ky"))
            );

            const newImages = imagesFiles.map((file, i) => ({
                url: "product/" + file.filename,
                alt: {
                    ru: alts[i] || "",
                    ky: altsKy[i] || "",
                },
            }));

            product.images.push(...newImages);
            await product.save();

            const updated = await Product.findById(product._id).populate("category");
            res.send({message: "Изображения добавлены", product: updated});
        } catch (e) {
            next(e);
        }
    }
);

productsSuperAdminRouter.patch("/:id", productImage.fields([
    {name: "cover", maxCount: 1},
    {name: "images"},
    {name: "icon", maxCount: 1}
]), async (req, res, next) => {
    try {
        const files = req.files as {
            [fieldname: string]: Express.Multer.File[];
        };

        const coverFile = files.cover?.[0];
        const imagesFiles = files.images || [];
        const iconFile = files.icon?.[0];

        const {id} = req.params;
        const {category, title, description, seoTitle, seoDescription, mode = "replace"} = req.body;

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
            product.seoTitle = {
                ru: seoTitle?.trim() || null,
                ky: await translateYandex(seoTitle?.trim() || "", "ky")
            };
        }

        if (seoDescription !== undefined) {
            product.seoDescription = {
                ru: seoDescription?.trim() || null,
                ky: await translateYandex(seoDescription?.trim() || "", "ky")
            };
        }

        if (description) {
            const desKy = await translateYandex(description, "ky");
            product.description = {ru: description.trim(), ky: desKy};
        }

        if (req.body.characteristics) {
            try {
                const original = JSON.parse(req.body.characteristics);
                const translatedChars = await Promise.all(
                    original.map(async (char: { key: { ru: string }; value: { ru: string } }) => ({
                        key: {
                            ru: char.key.ru,
                            ky: await translateYandex(char.key.ru, "ky")
                        },
                        value: {
                            ru: char.value.ru,
                            ky: await translateYandex(char.value.ru, "ky")
                        }
                    }))
                );

                product.set('characteristics', translatedChars);
            } catch {
                res.status(400).send({error: "Некорректный формат characteristics"});
                return;
            }
        }

        if (imagesFiles && imagesFiles.length > 0) {
            try {
                const alts: string[] = Array.isArray(req.body.alts) ? req.body.alts : [req.body.alts];
                const altsKy = await Promise.all(alts.map((alt) => translateYandex(alt || '', "ky")));

                const newImages = imagesFiles.map((file, i) => ({
                    image: "product/" + file.filename,
                    alt: {
                        ru: alts[i] || '',
                        ky: altsKy[i] || '',
                    },
                }));

                if (mode === "append") {
                    product.set('images', [...(product.images || []), ...newImages]);
                } else {
                    product.set('images', newImages);
                }
            } catch (error) {
                console.error('Error processing images:', error);
                res.status(400).send({error: "Некорректный формат images"});
                return;
            }
        }

        if (!product.sale) {
            product.sale = {isOnSale: false, label: ""};
        }

        if (req.body.isOnSale !== undefined) {
            product.sale.isOnSale = req.body.isOnSale === 'true';
        }

        if (req.body.saleLabel !== undefined) {
            product.sale.label = req.body.saleLabel || ''
        }

        if (iconFile) {
            const iconAltRu = req.body.iconAlt || '';
            const iconAltKy = await translateYandex(iconAltRu, "ky");

            product.icon = {
                url: `product/${iconFile.filename}`,
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
                url: `product/${coverFile.filename}`,
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


productsSuperAdminRouter.patch("/images/:imageId", productImage.fields([{
    name: "images",
    maxCount: 1
}]), async (req, res, next) => {
    try {
        const {imageId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            res.status(400).send({error: "Неверный ID изображения"});
            return;
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const file = files.images?.[0];
        const newAlt = req.body.alt;

        const updateFields: any = {};
        if (file) updateFields["images.$.image"] = "product/" + file.filename;
        if (newAlt) {
            updateFields["images.$.alt.ru"] = newAlt;
            updateFields["images.$.alt.ky"] = await translateYandex(newAlt, "ky");
        }

        const product = await Product.findOne({"images._id": imageId});
        if (!product) {
            res.status(404).send({error: "Продукт или изображение не найдено"});
            return;
        }

        const updateResult = await Product.updateOne(
            {"images._id": imageId},
            {$set: updateFields}
        );

        if (updateResult.modifiedCount === 0) {
            res.status(400).send({error: "Изменения не были применены"});
            return;
        }

        const updatedProduct = await Product.findOne({"images._id": imageId});
        res.send({product: updatedProduct});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.delete("/:id", async (req, res, next) => {
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

productsSuperAdminRouter.delete("/images/:imageId", async (req, res, next) => {
    try {
        const {imageId} = req.params;
        if (!mongoose.Types.ObjectId.isValid(imageId)) {
            res.status(400).send({error: "Неверный ID изображения"});
            return;
        }

        const updateResult = await Product.updateOne(
            {"images._id": imageId},
            {$pull: {images: {_id: imageId}}}
        );

        if (updateResult.modifiedCount === 0) {
            res.status(404).send({error: "Изображение не найдено или уже удалено"});
            return;
        }

        res.send({message: "Изображение успешно удалено"});
    } catch (e) {
        next(e);
    }
});

export default productsSuperAdminRouter;