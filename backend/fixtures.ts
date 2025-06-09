import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";
import {randomUUID} from "node:crypto";
import Category from "./models/Category";
import Product from "./models/Product";
import Post from "./models/Post";
import {PortfolioItem} from "./models/PortfolioItem";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('products');
        await db.dropCollection('categories');
        await db.dropCollection('users');
        await db.dropCollection('posts');
        await db.dropCollection('portfolioitems');
    } catch (e) {
        console.log('Коллекции отсутствовали, пропуск сброса');
    }

    await User.create(
        {
            email: 'bob@gmail.com',
            password: '123',
            confirmPassword: '123',
            role: 'superadmin',
            displayName: 'Бакыт',
            token: randomUUID(),
        },
        {
            email: 'alice@gmail.com',
            password: '123',
            confirmPassword: '123',
            role: 'admin',
            displayName: 'Алиса',
            token: randomUUID(),
        },
    );

    const [lightingTechnology, film] = await Category.create(
        {
            title: 'Светотехника',
        },
        {
            title: 'Пленка',
        },
        {
            title: 'Шпатель',
        },
        {
            title: 'Вентиляционные решетки',
        },
    );

    await Product.create(
        {
            category: lightingTechnology,
            title: 'Светодиодная лента leds power',
            description: 'световой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм',
            image: 'test/lightingTechnology1.jpg',
        },
        {
            category: lightingTechnology,
            title: 'Светодиодная лента vacco group',
            description: 'световой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм',
            image: 'test/lightingTechnology1.jpg',
        },
        {
            category: film,
            title: 'Пленка ПВХ LEGEND',
            description: 'ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см',
            image: 'test/legend-paint.jpg',
        },
        {
            category: film,
            title: 'Пленка ПВХ IDEAL',
            description: 'ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см',
            image: 'test/plenkaPBX.png',
        },
    );

    await Post.create(
        {
            title: 'Тестовый пост №1',
            description: 'Lorem ipsum',
            image: 'test/news1.jpg',
        },
        {
            title: 'Тестовый пост №2',
            description: 'Lorem ipsum',
            image: 'test/news2.png',
        },
    );

    await PortfolioItem.create(
        {
            cover: 'test/IMG_0448.jpg',
            gallery: [
                {
                    image: 'test/IMG_0450.jpg',
                },
                {
                    image: 'test/IMG_0451.jpg',
                },
            ],
        },
        {
            cover: 'test/IMG_2687.jpg',
            gallery: [
                {
                    image: 'test/IMG_2683.jpg',
                },
                {
                    image: 'test/IMG_2682.jpg',
                },
            ],
        }
    );
}

run().catch(console.error);