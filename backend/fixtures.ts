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
                ru: "Выходной",
                ky: "Эс алуу",
            },
        },
        linkLocation:
            "https://www.openstreetmap.org/export/embed.html?bbox=74.619%2C42.887%2C74.628%2C42.892&layer=mapnik&marker=42.890104%2C74.623837",
    });


    const [lightingTechnology, film, spatula, ventilationGrilles, spc] = await Category.create(
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
        {
            title: "SPC",
            slug: "spc"
        }
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
        {
            category: spc,
            title: 'Тис Альпик',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            image: 'test/laminate1.JPG',
        },
        {
            category: spc,
            title: 'Тис Латте',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            image: 'test/laminate2.JPG',
        },
        {
            category: spc,
            title: 'Бук Шале',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            image: 'test/laminate3.JPG',
        },
        {
            category: spc,
            title: 'Орех Шато',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            image: 'test/laminate4.JPG',
        },
        {
            category: spc,
            title: 'Дуб Классик',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            image: 'test/laminate5.JPG',
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
                ky: "Биздин адис сизге ыңгайлуу убакта келип, так өлчөөлөрдү жүргүзүп, сунуштарын берет."},
        },
        {
            title: {ru: "Монтаж потолков и ламината", ky: "Шыптар менен ламинатты орнотуу"},
            description: {
                ru: "Профессиональный монтаж натяжных потолков и укладка ламината любой сложности",
                ky: "Каалаган татаалдыктардагы керме шыптарды кесипкөй орнотуу жана ламинат төшөө"},
        },
        {
            title: {
                ru: "Расчет освещенности",
                ky: "Жарыктын эсептөөсү"},
            description: {
                ru: "Точный расчет освещения вашего помещения с учетом всех особенностей и пожеланий",
                ky: "Сиздин бөлмөңүздүн бардык өзгөчөлүктөрүн жана каалоолоруңузду эске алуу менен жарыктандыруунун так эсептөөсү"},
        }
    );
    await db.close();
}


run().catch(console.error);