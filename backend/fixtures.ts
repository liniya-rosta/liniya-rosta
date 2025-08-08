import mongoose from "mongoose";
import config from "./config";
import User from "./src/models/User";
import Category from "./src/models/Category";
import Product from "./src/models/Product";
import Post from "./src/models/Post";
import {PortfolioItem} from "./src/models/PortfolioItem";
import RequestFromClient from "./src/models/Request";
import Contact from "./src/models/Contact";
import Service from "./src/models/Service";
import ChatSession from "./src/models/ChatSession";

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
        await db.dropCollection('services');
        await db.dropCollection('chatsessions');
    } catch (e) {
        console.log('Коллекции отсутствовали, пропуск сброса');
    }

    const [Bob, Alice] = await User.create(
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
        location: {
            ru: "г. Бишкек, ул. Куренкеева 49",
            ky: "Бишкек ш., Куренкеев көч. 49",
        },
        phone1: "+996700123456",
        phone2: "+996555654321",
        email: "liniyarosta49@gmail.com",
        whatsapp: "+996555654321",
        instagram: "https://www.instagram.com/liniya_rosta.kg/",
        mapLocation: "https://2gis.kg/bishkek/firm/70000001094990183?m=74.623804%2C42.890143%2F16",
        workingHours: {
            monday: {
                ru: "09:00–15:00",
                ky: "09:00–15:00",
            },
            tuesday: {
                ru: "09:00–17:00",
                ky: "09:00–17:00",
            },
            wednesday: {
                ru: "09:00–17:00",
                ky: "09:00–17:00",
            },
            thursday: {
                ru: "09:00–17:00",
                ky: "09:00–17:00",
            },
            friday: {
                ru: "09:00–17:00",
                ky: "09:00–17:00",
            },
            saturday: {
                ru: "09:00–15:00",
                ky: "09:00–15:00",
            },
            sunday: {
                ru: "Выходной день",
                ky: "Эс алуу күнү",
            },
        },
        linkLocation:
            "https://www.openstreetmap.org/export/embed.html?bbox=74.619%2C42.887%2C74.628%2C42.892&layer=mapnik&marker=42.890104%2C74.623837",
    });


    const [lightingTechnology, film, spatula, ventilationGrilles, spc] = await Category.create(
        {
            title: {
                ru: 'Светотехника',
                ky: 'Жарык техникасы',
            },
        },
        {
            title: {
                ru: 'Пленка',
                ky: 'Пленка',
            },
        },
        {
            title: {
                ru: 'Шпатель',
                ky: 'Шпатель',
            },
        },
        {
            title: {
                ru: 'Вентиляционные решетки',
                ky: 'Желдетүү торлору',
            },
        },
        {
            title: {
                ru: 'SPC',
                ky: 'SPC',
            },
            slug: 'spc',
        }
    );

    await Product.create(
        {
            category: lightingTechnology,
            title: { ru: "Светодиодная лента leds power", ky: "Светодиоддук лента leds power" },
            description: {
                ru: "световой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology1.jpg",
                alt: { ru: "светодиодная лента", ky: "светодиоддук лента" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: lightingTechnology,
            title: { ru: "Светодиодная лента vacco group", ky: "Светодиоддук лента vacco group" },
            description: {
                ru: "световой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology1.jpg",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: film,
            title: { ru: "Пленка ПВХ LEGEND", ky: "ПВХ пленка LEGEND" },
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/legend-paint.jpg",
                alt: { ru: "свет", ky: "жарык" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: film,
            title: { ru: "Пленка ПВХ IDEAL", ky: "ПВХ пленка IDEAL" },
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/plenkaPBX.png",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: film,
            title: { ru: "Пленка ПВХ as;lkdf;sajf", ky: "ПВХ пленка as;lkdf;sajf" },
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/plenkaPBX.png",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "Тис Альпик", ky: "Тис Альпик" },
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate1.JPG",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "Тис Латте", ky: "Тис Латте" },
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate2.JPG",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "Бук Шале", ky: "Бук Шале" },
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate3.JPG",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "Орех Шато", ky: "Орех Шато" },
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate4.JPG",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "Дуб Классик", ky: "Дуб Классик" },
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate5.JPG",
                alt: { ru: "", ky: "" }
            },
            characteristics: [
                { key: { ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү" }, value: { ru: "Значение", ky: "Маани" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: lightingTechnology,
            title: { ru: "Светильник POINT 600", ky: "Чырак POINT 600" },
            description: {
                ru: "Мощность: 24 Вт, свет: холодный белый 6000К, диаметр: 300 мм",
                ky: "Кубаттуулугу: 24 Вт, жарык: муздак ак 6000К, диаметри: 300 мм"
            },
            cover: {
                url: "test/lightingTechnology1.jpg",
                alt: { ru: "Светильник POINT 600", ky: "Чырак POINT 600" }
            },
            characteristics: [
                { key: { ru: "Мощность", ky: "Кубаттуулук" }, value: { ru: "24 Вт", ky: "24 Вт" } },
                { key: { ru: "Цветовая температура", ky: "Түс температурасы" }, value: { ru: "6000К", ky: "6000К" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: lightingTechnology,
            title: { ru: "Лента SMD 2835", ky: "Лента SMD 2835" },
            description: {
                ru: "120 LED/м, 12 В, IP65, ширина: 8 мм, катушка 5 м",
                ky: "120 LED/м, 12 В, IP65, туурасы: 8 мм, катушка 5 м"
            },
            cover: {
                url: "test/lightingTechnology1.jpg",
                alt: { ru: "Лента SMD 2835", ky: "Лента SMD 2835" }
            },
            characteristics: [
                { key: { ru: "Светодиоды", ky: "Жарык берүүчү диоддор" }, value: { ru: "SMD 2835", ky: "SMD 2835" } },
                { key: { ru: "Длина", ky: "Узундук" }, value: { ru: "5 м", ky: "5 м" } }
            ],
            sale: { isOnSale: true, label: { ru: "Топ продаж", ky: "Топ сатуу" } }
        },
        {
            category: film,
            title: { ru: "Пленка ПВХ SATIN", ky: "ПВХ пленка SATIN" },
            description: {
                ru: "Сатиновая текстура, ширина 3.2 м, толщина 0.2 мм",
                ky: "Сатин текстурасы, туурасы 3.2 м, калыңдыгы 0.2 мм"
            },
            cover: {
                url: "test/plenkaPBX.png",
                alt: { ru: "Пленка SATIN", ky: "Пленка SATIN" }
            },
            characteristics: [
                { key: { ru: "Поверхность", ky: "Бети" }, value: { ru: "Сатиновая", ky: "Сатин" } },
                { key: { ru: "Толщина", ky: "Калыңдыгы" }, value: { ru: "0.2 мм", ky: "0.2 мм" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: film,
            title: { ru: "Пленка ПВХ BLACK MIRROR", ky: "ПВХ пленка BLACK MIRROR" },
            description: {
                ru: "Глянцевая черная, плотность 220 г/м2, ширина 3.2 м",
                ky: "Жалтырак кара, тыгыздыгы 220 г/м2, туурасы 3.2 м"
            },
            cover: {
                url: "test/legend-paint.jpg",
                alt: { ru: "Пленка BLACK MIRROR", ky: "Пленка BLACK MIRROR" }
            },
            characteristics: [
                { key: { ru: "Цвет", ky: "Түс" }, value: { ru: "Черный", ky: "Кара" } },
                { key: { ru: "Поверхность", ky: "Бети" }, value: { ru: "Глянец", ky: "Жалтырак" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spc,
            title: { ru: "SPC Ясень Серый", ky: "SPC Күрөң Ашык" },
            description: {
                ru: "SPC ламинат с тиснением, замковое соединение, размер 180x1220",
                ky: "SPC ламинат, тиштүү, кулпулуу туташуусу, өлчөмү 180x1220"
            },
            cover: {
                url: "test/laminate1.JPG",
                alt: { ru: "SPC Ясень Серый", ky: "SPC Күрөң Ашык" }
            },
            characteristics: [
                { key: { ru: "Порода", ky: "Түрү" }, value: { ru: "Ясень", ky: "Ашык" } },
                { key: { ru: "Цвет", ky: "Түс" }, value: { ru: "Серый", ky: "Күрөң" } }
            ],
            sale: { isOnSale: true, label: { ru: "Новинка", ky: "Жаңы" } }
        },
        {
            category: spc,
            title: { ru: "SPC Дуб Молочный", ky: "SPC Сүттүк Дуб" },
            description: {
                ru: "180x1220x4.0/0.3 мм, IXPE, влагостойкий",
                ky: "180x1220x4.0/0.3 мм, IXPE, нымга туруктуу"
            },
            cover: {
                url: "test/laminate2.JPG",
                alt: { ru: "SPC Дуб Молочный", ky: "SPC Сүттүк Дуб" }
            },
            characteristics: [
                { key: { ru: "Цвет", ky: "Түс" }, value: { ru: "Молочный", ky: "Сүттүк" } },
                { key: { ru: "Подложка", ky: "Төмөнкү катмар" }, value: { ru: "IXPE", ky: "IXPE" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: spatula,
            title: { ru: "Шпатель усиленный 30 см", ky: "30 см күчөтүлгөн шпатель" },
            description: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            cover: {
                url: "test/laminate4.JPG",
                alt: { ru: "Шпатель усиленный", ky: "Күчөтүлгөн шпатель" }
            },
            characteristics: [
                { key: { ru: "Длина", ky: "Узундук" }, value: { ru: "30 см", ky: "30 см" } },
                { key: { ru: "Материал", ky: "Материал" }, value: { ru: "Алюминий", ky: "Алюминий" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: ventilationGrilles,
            title: { ru: "Решетка вентиляционная металлическая", ky: "Металл вентиляция тору" },
            description: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            cover: {
                url: "test/laminate1.JPG",
                alt: { ru: "Вентиляция металлическая", ky: "Металл вентиляция" }
            },
            characteristics: [
                { key: { ru: "Материал", ky: "Материал" }, value: { ru: "Металл", ky: "Металл" } },
                { key: { ru: "Размер", ky: "Өлчөмү" }, value: { ru: "150x150 мм", ky: "150x150 мм" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        },
        {
            category: ventilationGrilles,
            title: { ru: "Решетка с обратным клапаном", ky: "Кайтарма клапан тору" },
            description: {
                ru: "Квадратная, белая, обратный клапан против запахов",
                ky: "Тоголок, ак, жытка каршы клапан"
            },
            cover: {
                url: "test/laminate2.JPG",
                alt: { ru: "Решетка с клапаном", ky: "Клапан тору" }
            },
            characteristics: [
                { key: { ru: "Форма", ky: "Форма" }, value: { ru: "Квадрат", ky: "Тоголок" } },
                { key: { ru: "Особенность", ky: "Өзгөчөлүк" }, value: { ru: "Обратный клапан", ky: "Кайтарма клапан" } }
            ],
            sale: { isOnSale: false, label: { ru: null, ky: null } }
        }
    );



    await Post.create([
        {
            title: {
                ru: 'Тестовый пост №1',
                ky: 'Тесттик пост №1'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {
                    image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 1",
                        ky: "Жаңылык 1"
                    }
                },
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 1",
                        ky: "Кошумча сүрөт 1"
                    }},
            ],
        },
        {
            title: {
                ru: 'Тестовый пост №2',
                ky: 'Тесттик пост №2'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 2",
                        ky: "Жаңылык 2"
                    }},
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }},
            ],
        },
        {
            title: {
                ru: 'Тестовый пост №3',
                ky: 'Тесттик пост №3'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 3",
                        ky: "Жаңылык 3"
                    }},
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 3",
                        ky: "Кошумча сүрөт 3"
                    }},
            ],
        },
        {
            title: {
                ru: 'Тестовый пост №4',
                ky: 'Тесттик пост №4'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 4",
                        ky: "Жаңылык 4"
                    }},
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 4",
                        ky: "Кошумча сүрөт 4"
                    }},
            ],
        },
        {
            title: {
                ru: 'Тестовый пост №5',
                ky: 'Тесттик пост №5'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 5",
                        ky: "Жаңылык 5"
                    }},
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 5",
                        ky: "Кошумча сүрөт 5"
                    }},
            ],
        },
        {
            title: {
                ru: 'Тестовый пост №6',
                ky: 'Тесттик пост №6'
            },
            description: {
                ru: 'Основной текст поста',
                ky: 'Посттун негизги тексти'
            },
            images: [
                {image: 'test/news1.jpg',
                    alt: {
                        ru: "Новость 6",
                        ky: "Жаңылык 6"
                    }},
                {image: 'test/news2.png',
                    alt: {
                        ru: "Доп изображение 6",
                        ky: "Кошумча сүрөт 6"
                    }},
            ],
        },
    ]);

    await PortfolioItem.create([
        {
            cover: 'test/IMG_0448.jpg',
            coverAlt: {ru: 'Обложка проекта 1', ky: 'Долбоордун мукабасы 1'},
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_0451.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_0449.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_0453.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_0454.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_0455.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_0610.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_0611.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            }
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: {ru: 'Обложка проекта 2', ky: 'Долбоордун мукабасы 2'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_2688.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_2685.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_2689.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_2690.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_2691.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_2692.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 9', ky: 'Галерея 9'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 10', ky: 'Галерея 10'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_0450.jpg',
            coverAlt: {ru: 'Обложка проекта 3', ky: 'Долбоордун мукабасы 3'},
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_0451.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_0449.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_0453.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_0454.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_0455.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_0610.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_0611.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_2688.jpg',
            coverAlt: {ru: 'Обложка проекта 4', ky: 'Долбоордун мукабасы 4'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_2688.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_2685.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_2689.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_2690.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_2691.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_2692.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 9', ky: 'Галерея 9'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 10', ky: 'Галерея 10'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_0454.jpg',
            coverAlt: {ru: 'Обложка проекта 5', ky: 'Долбоордун мукабасы 5'},
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: 'Галерея 1 - 1'},
                {image: 'test/IMG_0451.jpg', alt: 'Галерея 1 - 2'},
                {image: 'test/IMG_0449.jpg', alt: 'Галерея 1 - 3'},
                {image: 'test/IMG_0453.jpg', alt: 'Галерея 1 - 4'},
                {image: 'test/IMG_0454.jpg', alt: 'Галерея 1 - 5'},
                {image: 'test/IMG_0455.jpg', alt: 'Галерея 1 - 6'},
                {image: 'test/IMG_0610.jpg', alt: 'Галерея 1 - 7'},
                {image: 'test/IMG_0611.jpg', alt: 'Галерея 1 - 8'},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_2682.jpg',
            coverAlt: {ru: 'Обложка проекта 6', ky: 'Долбоордун мукабасы 6'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_2688.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_2685.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_2689.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_2690.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_2691.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_2692.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 9', ky: 'Галерея 9'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 10', ky: 'Галерея 10'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_0454.jpg',
            coverAlt: {ru: 'Обложка проекта 7', ky: 'Долбоордун мукабасы 7'},
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_0451.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_0449.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_0453.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_0454.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_0455.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_0610.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_0611.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: {ru: 'Обложка проекта 8', ky: 'Долбоордун мукабасы 8'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: "Галерея 1"}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2 ', ky: "Галерея 2"}},
                {image: 'test/IMG_2688.jpg', alt: {ru: 'Галерея 3', ky: "Галерея 3"}},
                {image: 'test/IMG_2685.jpg', alt: {ru: 'Галерея 4', ky: "Галерея 4"}},
                {image: 'test/IMG_2689.jpg', alt: {ru: 'Галерея 5', ky: "Галерея 5"}},
                {image: 'test/IMG_2690.jpg', alt: {ru: 'Галерея 6', ky: "Галерея 6"}},
                {image: 'test/IMG_2691.jpg', alt: {ru: 'Галерея 7', ky: "Галерея 7"}},
                {image: 'test/IMG_2692.jpg', alt: {ru: 'Галерея 8', ky: "Галерея 8"}},
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 9', ky: "Галерея 9"}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 10', ky: "Галерея 10"}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_0448.jpg',
            coverAlt: {ru: 'Обложка проекта 9', ky: 'Долбоордун мукабасы 9'},
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_0451.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_0449.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_0453.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_0454.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_0455.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_0610.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_0611.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: {ru: 'Обложка проекта 10', ky: 'Долбоордун мукабасы 10'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
                {image: 'test/IMG_2688.jpg', alt: {ru: 'Галерея 3', ky: 'Галерея 3'}},
                {image: 'test/IMG_2685.jpg', alt: {ru: 'Галерея 4', ky: 'Галерея 4'}},
                {image: 'test/IMG_2689.jpg', alt: {ru: 'Галерея 5', ky: 'Галерея 5'}},
                {image: 'test/IMG_2690.jpg', alt: {ru: 'Галерея 6', ky: 'Галерея 6'}},
                {image: 'test/IMG_2691.jpg', alt: {ru: 'Галерея 7', ky: 'Галерея 7'}},
                {image: 'test/IMG_2692.jpg', alt: {ru: 'Галерея 8', ky: 'Галерея 8'}},
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 9', ky: 'Галерея 9'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 10', ky: 'Галерея 10'}},
            ],
            description: {
                ru: 'Современная гостиная с натяжным потолком',
                ky: 'Заманбап конок бөлмө чоюлма шып менен',
            },
        }
    ]);

    await RequestFromClient.create(
        {
            name: "Нурбек",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Александр",
            phone: "+996550654321",
            email: 'alex@gmail.com',
            isArchived: false
        },
        {
            name: "Айдана",
            phone: "+996555112233",
            email: 'aidana@gmail.com',
            isArchived: false
        },
    );

    await Service.create(
        {
            title: {ru: "Выезд на замер", ky: "Өлчөө үчүн баруу"},
            description: {
                ru: "Наш специалист приедет к вам в удобное время, сделает точные замеры и даст рекомендации",
                ky: "Биздин адис сизге ыңгайлуу убакта келип, так өлчөөлөрдү жүргүзүп, сунуштарын берет."
            },
        },
        {
            title: {ru: "Монтаж потолков и ламината", ky: "Шыптар менен ламинатты орнотуу"},
            description: {
                ru: "Профессиональный монтаж натяжных потолков и укладка ламината любой сложности",
                ky: "Каалаган татаалдыктардагы керме шыптарды кесипкөй орнотуу жана ламинат төшөө"
            },
        },
        {
            title: {
                ru: "Расчет освещенности",
                ky: "Жарыктын эсептөөсү"
            },
            description: {
                ru: "Точный расчет освещения вашего помещения с учетом всех особенностей и пожеланий",
                ky: "Сиздин бөлмөңүздүн бардык өзгөчөлүктөрүн жана каалоолоруңузду эске алуу менен жарыктандыруунун так эсептөөсү"
            },
        }
    );

    await ChatSession.create([
        {
            clientName: "User 1",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 2",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
        {
            clientName: "User 3",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "User 3",
                    text: "Спасибо за помощь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 20),
                },
                {
                    sender: "admin",
                    senderName: "Bob",
                    text: "Обращайтесь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 25),
                },
            ],
        },
        {
            clientName: "User 4",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "User 4",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },
        {
            clientName: "User 5",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 6",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
        {
            clientName: "User 7",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "User 3",
                    text: "Спасибо за помощь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 20),
                },
                {
                    sender: "admin",
                    senderName: "Bob",
                    text: "Обращайтесь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 25),
                },
            ],
        },
        {
            clientName: "User 8",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "User 4",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },

        {
            clientName: "User 9",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 10",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
        {
            clientName: "User 11",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "User 3",
                    text: "Спасибо за помощь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 20),
                },
                {
                    sender: "admin",
                    senderName: "Bob",
                    text: "Обращайтесь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 25),
                },
            ],
        },
        {
            clientName: "User 12",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "User 4",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },
        {
            clientName: "User 13",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 14",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
        {
            clientName: "User 15",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "User 3",
                    text: "Спасибо за помощь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 20),
                },
                {
                    sender: "admin",
                    senderName: "Bob",
                    text: "Обращайтесь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 25),
                },
            ],
        },
        {
            clientName: "User 16",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "User 4",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },

        {
            clientName: "User 17",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 18",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
        {
            clientName: "User 19",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "User 3",
                    text: "Спасибо за помощь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 20),
                },
                {
                    sender: "admin",
                    senderName: "Bob",
                    text: "Обращайтесь!",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 25),
                },
            ],
        },
        {
            clientName: "User 20",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "User 4",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },
        {
            clientName: "User 21",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "User 1",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "User 22",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "User 2",
                    text: "Есть ли у вас гарантия?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 5),
                },
                {
                    sender: "admin",
                    senderName: "Alice",
                    text: "Да, конечно. Мы даём гарантию на 2 года.",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1 + 1000 * 60 * 10),
                },
            ],
        },
    ]);

    await db.close();
}


run().catch(console.error);