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
        whatsapp: "+996555654321",
        instagram: "https://www.instagram.com/liniya_rosta.kg/",
        mapLocation: "https://2gis.kg/bishkek/firm/70000001094990183?m=74.623804%2C42.890143%2F16",
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
            cover: {
                url: 'test/lightingTechnology1.jpg',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: lightingTechnology,
            title: 'Светодиодная лента vacco group',
            description: 'световой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм',
            cover: {
                url: 'test/lightingTechnology1.jpg',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: film,
            title: 'Пленка ПВХ LEGEND',
            description: 'ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см',
            cover: {
                url: 'test/legend-paint.jpg',
                alt: "свет"
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: film,
            title: 'Пленка ПВХ IDEAL',
            description: 'ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см',
            cover: {
                url: 'test/plenkaPBX.png',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: film,
            title: 'Пленка ПВХ as;lkdf;sajf',
            description: 'ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см',
            cover: {
                url: 'test/plenkaPBX.png',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'Тис Альпик',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            cover: {
                url: 'test/laminate1.JPG',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'Тис Латте',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            cover: {
                url: 'test/laminate2.JPG',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'Бук Шале',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            cover: {
                url: 'test/laminate3.JPG',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'Орех Шато',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            cover: {
                url: 'test/laminate4.JPG',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'Дуб Классик',
            description: 'Размер: 180x1220x4,0/0,3+1ммIXPE',
            cover: {
                url: 'test/laminate5.JPG',
                alt: null
            },
            characteristics: [
                {key: 'Пример характеристики', value: 'Значение'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
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
            coverAlt: 'Обложка проекта 1',
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
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: 'Обложка проекта 2',
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 1'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 2'},
                {image: 'test/IMG_2688.jpg', alt: 'Галерея 2 - 3'},
                {image: 'test/IMG_2685.jpg', alt: 'Галерея 2 - 4'},
                {image: 'test/IMG_2689.jpg', alt: 'Галерея 2 - 5'},
                {image: 'test/IMG_2690.jpg', alt: 'Галерея 2 - 6'},
                {image: 'test/IMG_2691.jpg', alt: 'Галерея 2 - 7'},
                {image: 'test/IMG_2692.jpg', alt: 'Галерея 2 - 8'},
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 9'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 10'},
            ],
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_0450.jpg',
            coverAlt: 'Обложка проекта 3',
            gallery: [
                {image: 'test/IMG_0450.jpg', alt: 'Галерея 3 - 1'},
                {image: 'test/IMG_0451.jpg', alt: 'Галерея 3 - 2'},
                {image: 'test/IMG_0449.jpg', alt: 'Галерея 3 - 3'},
                {image: 'test/IMG_0453.jpg', alt: 'Галерея 3 - 4'},
                {image: 'test/IMG_0454.jpg', alt: 'Галерея 3 - 5'},
                {image: 'test/IMG_0455.jpg', alt: 'Галерея 3 - 6'},
                {image: 'test/IMG_0610.jpg', alt: 'Галерея 3 - 7'},
                {image: 'test/IMG_0611.jpg', alt: 'Галерея 3 - 8'},
            ],
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_2688.jpg',
            coverAlt: 'Обложка проекта 4',
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 4 - 1'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 4 - 2'},
                {image: 'test/IMG_2688.jpg', alt: 'Галерея 4 - 3'},
                {image: 'test/IMG_2685.jpg', alt: 'Галерея 4 - 4'},
                {image: 'test/IMG_2689.jpg', alt: 'Галерея 4 - 5'},
                {image: 'test/IMG_2690.jpg', alt: 'Галерея 4 - 6'},
                {image: 'test/IMG_2691.jpg', alt: 'Галерея 4 - 7'},
                {image: 'test/IMG_2692.jpg', alt: 'Галерея 4 - 8'},
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 4 - 9'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 4 - 10'},
            ],
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_0454.jpg',
            coverAlt: 'Обложка проекта 5',
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
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_2682.jpg',
            coverAlt: 'Обложка проекта 6',
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 1'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 2'},
                {image: 'test/IMG_2688.jpg', alt: 'Галерея 2 - 3'},
                {image: 'test/IMG_2685.jpg', alt: 'Галерея 2 - 4'},
                {image: 'test/IMG_2689.jpg', alt: 'Галерея 2 - 5'},
                {image: 'test/IMG_2690.jpg', alt: 'Галерея 2 - 6'},
                {image: 'test/IMG_2691.jpg', alt: 'Галерея 2 - 7'},
                {image: 'test/IMG_2692.jpg', alt: 'Галерея 2 - 8'},
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 9'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 10'},
            ],
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_0454.jpg',
            coverAlt: 'Обложка проекта 7',
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
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: 'Обложка проекта 8',
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 1'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 2'},
                {image: 'test/IMG_2688.jpg', alt: 'Галерея 2 - 3'},
                {image: 'test/IMG_2685.jpg', alt: 'Галерея 2 - 4'},
                {image: 'test/IMG_2689.jpg', alt: 'Галерея 2 - 5'},
                {image: 'test/IMG_2690.jpg', alt: 'Галерея 2 - 6'},
                {image: 'test/IMG_2691.jpg', alt: 'Галерея 2 - 7'},
                {image: 'test/IMG_2692.jpg', alt: 'Галерея 2 - 8'},
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 9'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 10'},
            ],
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_0448.jpg',
            coverAlt: 'Обложка проекта 9',
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
            description: 'Современная гостиная с натяжным потолком',
        },
        {
            cover: 'test/IMG_2687.jpg',
            coverAlt: 'Обложка проекта 10',
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 1'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 2'},
                {image: 'test/IMG_2688.jpg', alt: 'Галерея 2 - 3'},
                {image: 'test/IMG_2685.jpg', alt: 'Галерея 2 - 4'},
                {image: 'test/IMG_2689.jpg', alt: 'Галерея 2 - 5'},
                {image: 'test/IMG_2690.jpg', alt: 'Галерея 2 - 6'},
                {image: 'test/IMG_2691.jpg', alt: 'Галерея 2 - 7'},
                {image: 'test/IMG_2692.jpg', alt: 'Галерея 2 - 8'},
                {image: 'test/IMG_2683.jpg', alt: 'Галерея 2 - 9'},
                {image: 'test/IMG_2682.jpg', alt: 'Галерея 2 - 10'},
            ],
            description: 'Современная гостиная с натяжным потолком',
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
            title: "Выезд на замер",
            description: "Наш специалист приедет к вам в удобное время, сделает точные замеры и даст рекомендации",
        },
        {
            title: "Монтаж потолков и ламината",
            description: "Профессиональный монтаж натяжных потолков и укладка ламината любой сложности",
        },
        {
            title: "Расчет освещенности",
            description: "Точный расчет освещения вашего помещения с учетом всех особенностей и пожеланий",
        }
    );
    await db.close();
}


run().catch(console.error);