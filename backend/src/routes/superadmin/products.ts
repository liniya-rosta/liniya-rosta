import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";
import mongoose from "mongoose";
import {productImage} from "../../middleware/multer";

const productsSuperAdminRouter = express.Router();

productsSuperAdminRouter.post("/", productImage.single("image"), async (req, res, next) => {
    try {
        const {category, title, description} = req.body;
        if (!category || !title || !title.trim() || !req.file) {
            res.status(400).send({error: "Категория, заголовок и изображение обязательны"});
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

        const parsedImages = req.body.images ? JSON.parse(req.body.images) : [];
        const parsedCharacteristics = req.body.characteristics ? JSON.parse(req.body.characteristics) : [];

        const product = new Product({
            category,
            title: title.trim(),
            description: description?.trim() || null,
            cover: {
                url: `product/${req.file.filename}`,
                alt: req.body.coverAlt || null,
            },
            images: parsedImages,
            characteristics: parsedCharacteristics,
            sale: {
                isOnSale: req.body.isOnSale === 'true',
                label: req.body.saleLabel || null,
            },
            icon: {
                url: req.body.iconUrl,
                alt: req.body.iconAlt || null,
            },
        });

        await product.save();
        res.send({message: "Продукт создан успешно", product});
    } catch (e) {
        next(e);
    }
});

productsSuperAdminRouter.patch("/:id", productImage.single("image"), async (req, res, next) => {
    try {
        const {id} = req.params;
        const {category, title, description} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID продукта"});
            return;
        }

        if (!category && !title && !description && !req.file) {
            res.status(400).send({error: "Не указаны поля для обновления"});
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
        }

        if (title && !title.trim()) {
            res.status(400).send({error: "Заголовок не может быть пустым"});
            return;
        }

        if (description?.trim() === '') {
            res.status(400).send({error: "Описание не может быть пустым"});
            return;
        }

        if (category) product.category = category;
        if (title) product.title = title.trim();
        if (description !== undefined) product.description = description;

        if (req.body.images) {
            try {
                product.images = JSON.parse(req.body.images);
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

        if (!product.sale) {
            product.sale = {isOnSale: false, label: ''};
        }

        if (req.body.isOnSale !== undefined) {
            product.sale.isOnSale = req.body.isOnSale === 'true';
        }

        if (req.body.saleLabel !== undefined) {
            product.sale.label = typeof req.body.saleLabel === 'string' ? req.body.saleLabel : '';
        }

        if (req.body.iconUrl !== undefined || req.body.iconAlt !== undefined) {
            product.icon = {
                url: req.body.iconUrl || '',
                alt: typeof req.body.iconAlt === 'string' ? req.body.iconAlt : '',
            };
        }

        if (req.file) product.cover = {
            url: `product/${req.file.filename}`,
            alt: typeof req.body.coverAlt === 'string' ? req.body.coverAlt : '',
        };
        await product.save();
        res.send({message: "Продукт обновлен успешно", product});
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

export default productsSuperAdminRouter;