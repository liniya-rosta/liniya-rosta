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
            cover: {
                url: 'test/lightingTechnology1.jpg',
                alt: 'a;lskdjf'
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
        {
            category: lightingTechnology,
            title: 'Светильник POINT 600',
            description: 'Мощность: 24 Вт, свет: холодный белый 6000К, диаметр: 300 мм',
            cover: {
                url: 'test/lightingTechnology1.jpg',
                alt: 'Светильник POINT 600'
            },
            characteristics: [
                {key: 'Мощность', value: '24 Вт'},
                {key: 'Цветовая температура', value: '6000К'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: lightingTechnology,
            title: 'Лента SMD 2835',
            description: '120 LED/м, 12 В, IP65, ширина: 8 мм, катушка 5 м',
            cover: {
                url: 'test/lightingTechnology1.jpg',
                alt: 'Лента SMD 2835'
            },
            characteristics: [
                {key: 'Светодиоды', value: 'SMD 2835'},
                {key: 'Длина', value: '5 м'}
            ],
            sale: {
                isOnSale: true,
                label: 'Топ продаж'
            }
        },
        {
            category: film,
            title: 'Пленка ПВХ SATIN',
            description: 'Сатиновая текстура, ширина 3.2 м, толщина 0.2 мм',
            cover: {
                url: 'test/plenkaPBX.png',
                alt: 'Пленка SATIN'
            },
            characteristics: [
                {key: 'Поверхность', value: 'Сатиновая'},
                {key: 'Толщина', value: '0.2 мм'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: film,
            title: 'Пленка ПВХ BLACK MIRROR',
            description: 'Глянцевая черная, плотность 220 г/м2, ширина 3.2 м',
            cover: {
                url: 'test/legend-paint.jpg',
                alt: 'Пленка BLACK MIRROR'
            },
            characteristics: [
                {key: 'Цвет', value: 'Черный'},
                {key: 'Поверхность', value: 'Глянец'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'SPC Ясень Серый',
            description: 'SPC ламинат с тиснением, замковое соединение, размер 180x1220',
            cover: {
                url: 'test/laminate1.JPG',
                alt: 'SPC Ясень Серый'
            },
            characteristics: [
                {key: 'Порода', value: 'Ясень'},
                {key: 'Цвет', value: 'Серый'}
            ],
            sale: {
                isOnSale: true,
                label: 'Новинка'
            }
        },
        {
            category: spc,
            title: 'SPC Дуб Молочный',
            description: '180x1220x4.0/0.3 мм, IXPE, влагостойкий',
            cover: {
                url: 'test/laminate2.JPG',
                alt: 'SPC Дуб Молочный'
            },
            characteristics: [
                {key: 'Цвет', value: 'Молочный'},
                {key: 'Подложка', value: 'IXPE'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spc,
            title: 'SPC Клен Канадский',
            description: 'SPC 4 мм + 1 мм подложка, прочный, светлый тон',
            cover: {
                url: 'test/laminate3.JPG',
                alt: 'SPC Клен Канадский'
            },
            characteristics: [
                {key: 'Цвет', value: 'Светлый'},
                {key: 'Порода', value: 'Клен'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spatula,
            title: 'Шпатель усиленный 30 см',
            description: 'Алюминиевый шпатель с резиновой вставкой, ручка soft-touch',
            cover: {
                url: 'test/laminate4.JPG',
                alt: 'Шпатель усиленный'
            },
            characteristics: [
                {key: 'Длина', value: '30 см'},
                {key: 'Особенность', value: 'Усиленный'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: spatula,
            title: 'Шпатель 15 см',
            description: 'Компактный шпатель для мелких работ, пластик',
            cover: {
                url: 'test/laminate5.JPG',
                alt: 'Шпатель 15 см'
            },
            characteristics: [
                {key: 'Длина', value: '15 см'},
                {key: 'Материал', value: 'Пластик'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: ventilationGrilles,
            title: 'Решетка вентиляционная металлическая',
            description: 'Металлическая вентиляция, 150х150 мм, окрашенная',
            cover: {
                url: 'test/laminate1.JPG',
                alt: 'Вентиляция металлическая'
            },
            characteristics: [
                {key: 'Материал', value: 'Металл'},
                {key: 'Размер', value: '150x150 мм'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        },
        {
            category: ventilationGrilles,
            title: 'Решетка с обратным клапаном',
            description: 'Квадратная, белая, обратный клапан против запахов',
            cover: {
                url: 'test/laminate2.JPG',
                alt: 'Решетка с клапаном'
            },
            characteristics: [
                {key: 'Форма', value: 'Квадрат'},
                {key: 'Особенность', value: 'Обратный клапан'}
            ],
            sale: {
                isOnSale: false,
                label: null
            }
        }
    );

    await Post.create(
        {
            title: 'Тестовый пост №1',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №2',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №3',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №4',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №5',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №6',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №7',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №8',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №9',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
        },
        {
            title: 'Тестовый пост №10',
            description: 'Lorem ipsum',
            images: [
                {image: 'test/news1.jpg', alt: 'Новость 1'},
                {image: 'test/news2.png', alt: 'Доп. изображение 1'},
            ],
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