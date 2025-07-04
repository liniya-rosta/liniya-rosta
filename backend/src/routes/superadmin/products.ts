import express from 'express';
import Product from "../../models/Product";
import Category from "../../models/Category";
import mongoose from "mongoose";
import {productImage} from "../../middleware/multer";

const productsSuperAdminRouter = express.Router();

productsSuperAdminRouter.post("/", productImage.fields([
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

        const {category, title, description} = req.body;
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
        const images = imagesFiles.map((file, i) => ({
            url: "product/" + file.filename,
            alt: alts[i] || null,
        }));
        const parsedCharacteristics = req.body.characteristics ? JSON.parse(req.body.characteristics) : [];

        const product = new Product({
            category,
            title: title.trim(),
            description: description?.trim() || null,
            cover: {
                url: `product/${coverFile.filename}`,
                alt: req.body.coverAlt || null,
            },
            images,
            characteristics: parsedCharacteristics,
            sale: {
                isOnSale: req.body.isOnSale === 'true',
                label: req.body.saleLabel || null,
            },
            icon: {
                url: iconFile ? `product/${iconFile.filename}` : null,
                alt: req.body.iconAlt || null,
            },
        });

        await product.save();
        res.send({message: "Продукт создан успешно", product});
    } catch (e) {
        next(e);
    }
});

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
        const {category, title, description} = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).send({error: "Неверный формат ID продукта"});
            return;
        }

        if (!category && !title && !description && !coverFile && !req.body.images && !req.body.characteristics) {
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

        if (imagesFiles.length > 0) {
            const alts: string[] = Array.isArray(req.body.alt) ? req.body.alt : [req.body.alt];

            product.set('images', imagesFiles.map((file, i) => ({
                url: "product/" + file.filename,
                alt: alts[i] || null,
            })));
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

        if (iconFile) {
            product.icon = {
                url: `product/${iconFile.filename}`,
                alt: typeof req.body.iconAlt === 'string' ? req.body.iconAlt : '',
            };
        }

        if (coverFile) {
            product.cover = {
                url: `product/${coverFile.filename}`,
                alt: typeof req.body.coverAlt === 'string' ? req.body.coverAlt : '',
            };
        }
        await product.save();
        res.send({message: "Продукт обновлен успешно", product});
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
        if (file) updateFields["images.$.url"] = "product/" + file.filename;
        if (newAlt) updateFields["images.$.alt"] = newAlt;

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
        res.send(updatedProduct);
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