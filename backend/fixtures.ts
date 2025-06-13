import mongoose from "mongoose";
import config from "./config";
import User from "./src/models/User";
import Category from "./src/models/Category";
import Product from "./src/models/Product";
import Post from "./src/models/Post";
import {PortfolioItem} from "./src/models/PortfolioItem";
import RequestFromClient from "./src/models/Request";
import Contact from "./src/models/Contact";

const run = async () => {
    await mongoose.connect(config.db);
    const db = mongoose.connection;

    try {
        await db.dropCollection('products');
        await db.dropCollection('categories');
        await db.dropCollection('users');
        await db.dropCollection('posts');
        await db.dropCollection('portfolioitems');
        await db.dropCollection('requests');
        await db.dropCollection('contacts');
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
        },
        {
            email: 'alice@gmail.com',
            password: '123',
            confirmPassword: '123',
            role: 'admin',
            displayName: 'Алиса',
        },
    );

    await Contact.create({
        location: "г. Бишкек, Улица Куренкеева, 49",
        phone1: "+996700123456",
        phone2: "+996555654321",
        email: "liniyarosta49@gmail.com",
        whatsapp: "+996700123456",
        instagram: "https://www.instagram.com/liniya_rosta.kg/",
        mapLocation: "https://2gis.kg/bishkek/geo/15763234350959494/74.623805%2C42.89017",
        workingHours: {
            monday: "09:00–15:00",
            tuesday: "09:00–17:00",
            wednesday: "09:00–17:00",
            thursday: "09:00–17:00",
            friday: "09:00–17:00",
            saturday: "09:00–15:00",
            sunday: "Выходной"
        },
        linkLocation: "https://www.openstreetmap.org/export/embed.html?bbox=74.619%2C42.887%2C74.628%2C42.892&layer=mapnik&marker=42.890104%2C74.623837"
    });


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
        {
            category: film,
            title: 'Пленка ПВХ as;lkdf;sajf',
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

    await RequestFromClient.create(
        {
            name: "Нурбек",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
        },
        {
            name: "Александр",
            phone: "+996550654321",
            email: 'alex@gmail.com',
        },
        {
            name: "Айдана",
            phone: "+996555112233",
            email: 'aidana@gmail.com',
        },
    )
}

run().catch(console.error);