import 'dotenv/config';
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

console.log('MONGO_URI from .env =', process.env.MONGO_URI);
console.log('config.db =', config.db);

const run = async () => {
    try {
        console.log('Connecting to Mongo.......');
        await mongoose.connect(config.db!);
        console.log('✅ Connected');
    } catch (e) {
        console.error('❌ Mongo connect error:', e);
        process.exit(1);
    }

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


    const [lightingTechnology, film, spatula, ventilationGrilles, spc, stretchWallpaper] = await Category.create(
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
        },
        {
            title: {
                ru: 'Натяжные обои',
                ky: 'Тартылган обойлор',
            },
            slug: 'stretch-wallpaper',
        }
    );

    await Product.create(
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента Leds Power", ky: "Светодиоддук лента Leds Power"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology1.jpg",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: true, label: '20%', saleDate: "2025-08-30T18:00:00.000+00:00"},
            icon: {
                url: "test/leds-power-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента Lu Led", ky: "Светодиоддук лента Lu Led"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology2.png",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: false, label: ''},
            icon: {
                url: "test/leds-power-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента 1", ky: "Светодиоддук лента"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology3.png",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: true, label: '10%', saleDate: "2025-08-30T18:00:00.000+00:00"},
            icon: {
                url: "test/leds-power-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента 2", ky: "Светодиоддук лента"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology4.png",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: false, label: '',},
        },
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента Leds Power 1", ky: "Светодиоддук лента Leds Power"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology5.png",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: false, label: ''},
            icon: {
                url: "test/leds-power-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: lightingTechnology,
            title: {ru: "Светодиодная лента Leds Power 2", ky: "Светодиоддук лента Leds Power"},
            description: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            seoTitle: {
                ru: "Купить Светодиодная лента leds power в Бишкеке — Линия Роста",
                ky: "Бишкектен Светодиоддук лента leds power сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Cветовой поток: 1000 Лм/м, мощность: 10 Вт/м, длина: 5 м, ширина: 8 мм",
                ky: "Жарык агымы: 1000 Лм/м, кубаттуулугу: 10 Вт/м, узундугу: 5 м, туурасы: 8 мм"
            },
            cover: {
                url: "test/lightingTechnology6.png",
                alt: {ru: "светодиодная лента", ky: "светодиоддук лента"}
            },
            images: [
                {
                    image: "test/IMG_2692.jpg",
                    alt: {
                        ru: "Изображение 1",
                        ky: "Суроту 1"
                    },
                    _id: "68abec4afddeb14e66868cc7"
                },
                {
                    image: "test/IMG_2690.jpg",
                    alt: {
                        ru: "Изображение 2",
                        ky: "Суроту 2"
                    },
                    _id: "68abec4afddeb14e66858cc8"
                },
                {
                    image: "test/news-img5.jpg",
                    alt: {
                        ru: "Изображение 3",
                        ky: "Суроту 3"
                    },
                    _id: "68abec4afddeb14e65568cc7"
                }
            ],
            characteristics: [
                {key: {ru: "Световой поток", ky: "Жарык агымы"}, value: {ru: "1000 Лм/м", ky: "1000 Лм/м"}},
                {key: {ru: "Мощность", ky: "Кубаттуулугу"}, value: {ru: "10 Вт", ky: "10 Вт"}},
                {key: {ru: "Длина", ky: "Узундугу"}, value: {ru: "5 м", ky: "5 м"}},
                {key: {ru: "Ширина", ky: "Туурасы"}, value: {ru: "8 мм", ky: "8 мм"}},
                {key: {ru: "Количество диодов", ky: "Диоддордун саны"}, value: {ru: "40 шт", ky: "40 даана"}},
            ],
            sale: {isOnSale: false, label: ''},
            icon: {
                url: "test/leds-power-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },

        {
            category: spatula,
            title: {ru: "Шпатель усиленный 30 см", ky: "30 см күчөтүлгөн шпатель"},
            description: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            seoTitle: {
                ru: "Купить Шпатель усиленный 30 см в Бишкеке — Линия Роста",
                ky: "Бишкектен 30 см күчөтүлгөн шпатель сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            cover: {
                url: "test/Spatula1.png",
                alt: {ru: "Шпатель усиленный", ky: "Күчөтүлгөн шпатель"}
            },
            characteristics: [
                {key: {ru: "Длина", ky: "Узундук"}, value: {ru: "30 см", ky: "30 см"}},
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Алюминий", ky: "Алюминий"}}
            ],
            sale: {isOnSale: true, label: '20%', saleDate: "2025-08-30T18:00:00.000+00:00"},
        },
        {
            category: spatula,
            title: {ru: "Лопатка с выборкой теневая", ky: "30 см күчөтүлгөн шпатель"},
            description: {
                ru: "Лопатка теневая с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            seoTitle: {
                ru: "Купить Шпатель усиленный 30 см в Бишкеке — Линия Роста",
                ky: "Бишкектен 30 см күчөтүлгөн шпатель сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            cover: {
                url: "test/Spatula2.png",
                alt: {ru: "Шпатель усиленный", ky: "Күчөтүлгөн шпатель"}
            },
            characteristics: [
                {key: {ru: "Длина", ky: "Узундук"}, value: {ru: "30 см", ky: "30 см"}},
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Алюминий", ky: "Алюминий"}}
            ],
            sale: {isOnSale: false, label: '',},
        },
        {
            category: spatula,
            title: {ru: "Шпатель Рокер", ky: "Шпатель Рокер"},
            description: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            seoTitle: {
                ru: "Купить Шпатель усиленный 30 см в Бишкеке — Линия Роста",
                ky: "Бишкектен 30 см күчөтүлгөн шпатель сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            cover: {
                url: "test/Spatula3.png",
                alt: {ru: "Шпатель усиленный", ky: "Күчөтүлгөн шпатель"}
            },
            characteristics: [
                {key: {ru: "Длина", ky: "Узундук"}, value: {ru: "30 см", ky: "30 см"}},
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Алюминий", ky: "Алюминий"}}
            ],
            sale: {isOnSale: true, label: '10%', saleDate: "2025-08-30T18:00:00.000+00:00"},
        },
        {
            category: spatula,
            title: {ru: "Шпатель для вставки роликовый", ky: "Ролик кыстаруу шпатель"},
            description: {
                ru: "Шпатель для вставки роликовый с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            seoTitle: {
                ru: "Купить Шпатель усиленный 30 см в Бишкеке — Линия Роста",
                ky: "Бишкектен 30 см күчөтүлгөн шпатель сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Алюминиевый шпатель с резиновой вставкой, ручка soft-touch",
                ky: "Резина вставкасы бар алюминий шпатель, жумшак тутка"
            },
            cover: {
                url: "test/Spatula4.png",
                alt: {ru: "Шпатель усиленный", ky: "Күчөтүлгөн шпатель"}
            },
            characteristics: [
                {key: {ru: "Длина", ky: "Узундук"}, value: {ru: "30 см", ky: "30 см"}},
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Алюминий", ky: "Алюминий"}}
            ],
            sale: {isOnSale: true, label: ''}
        },

        {
            category: film,
            title: {ru: "Пленка ПВХ IDEAL", ky: "ПВХ пленка IDEAL"},
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            seoTitle: {
                ru: "Купить Пленка ПВХ IDEAL в Бишкеке — Линия Роста",
                ky: "Бишкектен ПВХ пленка IDEAL сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/PlenkaPBX.png",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'},
            icon: {
                url: "test/film-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: film,
            title: {ru: "Пленка ПВХ PREMIUM", ky: "Пленка ПВХ PREMIUM"},
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            seoTitle: {
                ru: "Купить Пленка ПВХ IDEAL в Бишкеке — Линия Роста",
                ky: "Бишкектен ПВХ пленка IDEAL сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/Plenka1.png",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'},
            icon: {
                url: "test/film-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },
        {
            category: film,
            title: {ru: "Пленка Эксклюзив: Искра", ky: "Пленка Эксклюзив: Искра"},
            description: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            seoTitle: {
                ru: "Купить Пленка ПВХ IDEAL в Бишкеке — Линия Роста",
                ky: "Бишкектен ПВХ пленка IDEAL сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "ЛАК:; толщина - 0,18±0,01 мм; ГР/М; плотность - 210 г/м2; ширина полотна - 320 см",
                ky: "ЛАК:; калыңдыгы - 0,18±0,01 мм; ГР/М; тыгыздыгы - 210 г/м2; туурасы - 320 см"
            },
            cover: {
                url: "test/Plenka2.png",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'},
            icon: {
                url: "test/film-icon.png",
                alt: {
                    ru: "Изображение иконки",
                    ky: "Сөлөкөт сүрөтү"
                }
            }
        },

        {
            category: ventilationGrilles,
            title: {ru: "Решетка вентиляционная магнитная", ky: "Металл вентиляция тору"},
            description: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            seoTitle: {
                ru: "Купить Решетка вентиляционная металлическая в Бишкеке — Линия Роста",
                ky: "Бишкектен Металл вентиляция тору сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            cover: {
                url: "test/Grilles1.png",
                alt: {ru: "Вентиляция металлическая", ky: "Металл вентиляция"}
            },
            characteristics: [
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Металл", ky: "Металл"}},
                {key: {ru: "Размер", ky: "Өлчөмү"}, value: {ru: "150x150 мм", ky: "150x150 мм"}}
            ],
            sale: {isOnSale: false, label: ''}
        },
        {
            category: ventilationGrilles,
            title: {ru: "Решетка вентиляционная металическая", ky: "Металл вентиляция тору"},
            description: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            seoTitle: {
                ru: "Купить Решетка вентиляционная металлическая в Бишкеке — Линия Роста",
                ky: "Бишкектен Металл вентиляция тору сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            cover: {
                url: "test/Grilles2.png",
                alt: {ru: "Вентиляция металлическая", ky: "Металл вентиляция"}
            },
            characteristics: [
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Металл", ky: "Металл"}},
                {key: {ru: "Размер", ky: "Өлчөмү"}, value: {ru: "150x150 мм", ky: "150x150 мм"}}
            ],
            sale: {isOnSale: false, label: ''}
        },
        {
            category: ventilationGrilles,
            title: {ru: "Решетка вентиляционная теневая", ky: "Металл вентиляция тору"},
            description: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            seoTitle: {
                ru: "Купить Решетка вентиляционная металлическая в Бишкеке — Линия Роста",
                ky: "Бишкектен Металл вентиляция тору сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            cover: {
                url: "test/Grilles3.png",
                alt: {ru: "Вентиляция металлическая", ky: "Металл вентиляция"}
            },
            characteristics: [
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Металл", ky: "Металл"}},
                {key: {ru: "Размер", ky: "Өлчөмү"}, value: {ru: "150x150 мм", ky: "150x150 мм"}}
            ],
            sale: {isOnSale: true, label: '10%', saleDate: "2025-08-30T18:00:00.000+00:00"}
        },
        {
            category: ventilationGrilles,
            title: {ru: "Решетка вентиляционная теневая 2", ky: "Металл вентиляция тору"},
            description: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            seoTitle: {
                ru: "Купить Решетка вентиляционная металлическая в Бишкеке — Линия Роста",
                ky: "Бишкектен Металл вентиляция тору сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Металлическая вентиляция, 150х150 мм, окрашенная",
                ky: "Металл вентиляция, 150х150 мм, боёлгон"
            },
            cover: {
                url: "test/Grilles4.png",
                alt: {ru: "Вентиляция металлическая", ky: "Металл вентиляция"}
            },
            characteristics: [
                {key: {ru: "Материал", ky: "Материал"}, value: {ru: "Металл", ky: "Металл"}},
                {key: {ru: "Размер", ky: "Өлчөмү"}, value: {ru: "150x150 мм", ky: "150x150 мм"}}
            ],
            sale: {isOnSale: false, label: ''}
        },

        {
            category: spc,
            title: {ru: "Тис Альпик", ky: "Тис Альпик"},
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            seoTitle: {
                ru: "Купить Тис Альпик в Бишкеке — Линия Роста",
                ky: "Бишкектен Тис Альпик сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate1.JPG",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "Тис Латте", ky: "Тис Латте"},
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            seoTitle: {
                ru: "Купить Тис Латте в Бишкеке — Линия Роста",
                ky: "Бишкектен Тис Латте сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate2.JPG",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "Бук Шале", ky: "Бук Шале"},
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            seoTitle: {
                ru: "Купить Бук Шале в Бишкеке — Линия Роста",
                ky: "Бишкектен Бук Шале сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate3.JPG",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "Орех Шато", ky: "Орех Шато"},
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            seoTitle: {
                ru: "Купить Орех Шато в Бишкеке — Линия Роста",
                ky: "Бишкектен Орех Шато сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate4.JPG",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "Дуб Классик", ky: "Дуб Классик"},
            description: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            seoTitle: {
                ru: "Купить Дуб Классик в Бишкеке — Линия Роста",
                ky: "Бишкектен Дуб Классик сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Размер: 180x1220x4,0/0,3+1ммIXPE",
                ky: "Өлчөмү: 180x1220x4,0/0,3+1ммIXPE"
            },
            cover: {
                url: "test/laminate5.JPG",
                alt: {ru: "", ky: ""}
            },
            characteristics: [
                {key: {ru: "Пример характеристики", ky: "Үлгү мүнөздөмөсү"}, value: {ru: "Значение", ky: "Маани"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "SPC Ясень Серый", ky: "SPC Күрөң Ашык"},
            description: {
                ru: "SPC ламинат с тиснением, замковое соединение, размер 180x1220",
                ky: "SPC ламинат, тиштүү, кулпулуу туташуусу, өлчөмү 180x1220"
            },
            seoTitle: {
                ru: "Купить SPC Ясень Серый в Бишкеке — Линия Роста",
                ky: "Бишкектен SPC Күрөң Ашык сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "SPC ламинат с тиснением, замковое соединение, размер 180x1220",
                ky: "SPC ламинат, тиштүү, кулпулуу туташуусу, өлчөмү 180x1220"
            },
            cover: {
                url: "test/laminate1.JPG",
                alt: {ru: "SPC Ясень Серый", ky: "SPC Күрөң Ашык"}
            },
            characteristics: [
                {key: {ru: "Порода", ky: "Түрү"}, value: {ru: "Ясень", ky: "Ашык"}},
                {key: {ru: "Цвет", ky: "Түс"}, value: {ru: "Серый", ky: "Күрөң"}}
            ],
            sale: {isOnSale: true, label: '20%'}
        },
        {
            category: spc,
            title: {ru: "SPC Дуб Молочный", ky: "SPC Сүттүк Дуб"},
            description: {
                ru: "180x1220x4.0/0.3 мм, IXPE, влагостойкий",
                ky: "180x1220x4.0/0.3 мм, IXPE, нымга туруктуу"
            },
            seoTitle: {
                ru: "Купить SPC Дуб Молочный в Бишкеке — Линия Роста",
                ky: "Бишкектен SPC Сүттүк Дуб сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "180x1220x4.0/0.3 мм, IXPE, влагостойкий",
                ky: "180x1220x4.0/0.3 мм, IXPE, нымга туруктуу"
            },
            cover: {
                url: "test/laminate2.JPG",
                alt: {ru: "SPC Дуб Молочный", ky: "SPC Сүттүк Дуб"}
            },
            characteristics: [
                {key: {ru: "Цвет", ky: "Түс"}, value: {ru: "Молочный", ky: "Сүттүк"}},
                {key: {ru: "Подложка", ky: "Төмөнкү катмар"}, value: {ru: "IXPE", ky: "IXPE"}}
            ],
            sale: {isOnSale: false, label: '20%'}
        },
        {
            category: stretchWallpaper,
            title: { ru: "Натяжные обои Premium White", ky: "Премиум Ак тартылган обойлор" },
            description: {
                ru: "Белые натяжные обои для жилых интерьеров. Идеально ровная поверхность, долговечность до 15 лет.",
                ky: "Турак жай интерьери үчүн ак тартылган обойлор. Идеалдуу түз бет, 15 жылга чейин кызмат кылат."
            },
            seoTitle: {
                ru: "Купить Натяжные обои Premium White в Бишкеке — Линия Роста",
                ky: "Бишкектен Премиум Ак тартылган обойлор сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Белые натяжные обои для жилых интерьеров. Гладкие, стильные, долговечные.",
                ky: "Ак тартылган обойлор. Гладкий, стильдүү жана узак кызмат кылат."
            },
            cover: {
                url: "test/wallpaper-1.JPG",
                alt: { ru: "натяжные обои белые", ky: "ак тартылган обойлор" }
            },
            images: [
                { image: "test/wallpaper-2.jpeg", alt: { ru: "Интерьер спальни", ky: "Жатак бөлмөнүн интерьери" } },
                { image: "test/wallpaper-3.jpeg", alt: { ru: "Интерьер гостиной", ky: "Конок бөлмөнүн интерьери" } }
            ],
            characteristics: [
                { key: { ru: "Цвет", ky: "Түсү" }, value: { ru: "Белый", ky: "Ак" } },
                { key: { ru: "Долговечность", ky: "Узак кызмат кылуу мөөнөтү" }, value: { ru: "15 лет", ky: "15 жыл" } },
                { key: { ru: "Применение", ky: "Колдонуу" }, value: { ru: "Жилые интерьеры", ky: "Турак жай интерьери" } },
            ],
            sale: { isOnSale: false },
            icon: {
                url: "test/stretch-wallpaper-icon.png",
                alt: { ru: "иконка обоев", ky: "обой иконкасы" }
            }
        },
        {
            category: stretchWallpaper,
            title: { ru: "Натяжные обои Modern Gray", ky: "Заманбап боз тартылган обойлор" },
            description: {
                ru: "Стильные серые натяжные обои для офисов и студий. Сочетают эстетику и шумоизоляцию.",
                ky: "Кеңселер жана студиялар үчүн заманбап боз тартылган обойлор. Эстетика жана үн өткөрбөөчүлүк."
            },
            seoTitle: {
                ru: "Купить Натяжные обои Modern Gray в Бишкеке — Линия Роста",
                ky: "Бишкектен Заманбап боз тартылган обойлор сатып алыңыз — Линия Роста"
            },
            seoDescription: {
                ru: "Серые натяжные обои для офисов и студий. Красота и шумоизоляция.",
                ky: "Кеңсе жана студия үчүн боз тартылган обойлор. Эстетика жана үн өткөрбөөчүлүк."
            },
            cover: {
                url: "test/wallpaper-2.jpeg",
                alt: { ru: "натяжные обои серые", ky: "боз тартылган обойлор" }
            },
            images: [
                { image: "test/wallpaper-4.jpeg", alt: { ru: "Офисный интерьер", ky: "Кеңсе интерьери" } },
                { image: "test/wallpaper-3.jpeg", alt: { ru: "Студия", ky: "Студия" } }
            ],
            characteristics: [
                { key: { ru: "Цвет", ky: "Түсү" }, value: { ru: "Серый", ky: "Боз" } },
                { key: { ru: "Звукоизоляция", ky: "Үн өткөрбөөчүлүк" }, value: { ru: "Да", ky: "Ооба" } },
                { key: { ru: "Применение", ky: "Колдонуу" }, value: { ru: "Коммерческие интерьеры", ky: "Коммерциялык интерьерлер" } },
            ],
            sale: { isOnSale: true, label: '10%', saleDate: "2025-09-15T18:00:00.000+00:00" },
            icon: {
                url: "test/stretch-wallpaper-icon2.png",
                alt: { ru: "иконка серых обоев", ky: "боз обойлордун иконкасы" }
            }
        }
    );

    await Post.create([
        {
            title: {
                ru: 'Что выбрать для пола — SPC-ламинат или обычный?',
                ky: 'Пол үчүн эмнени тандоо керек — SPC-ламинатпы же кадимкиби?'
            },
            description: {
                ru: 'Выбирая напольное покрытие, всё чаще покупатели сталкиваются с новым вариантом — SPC-ламинат. Это современный материал, который становится отличной альтернативой классическому ламинату. Разберёмся, в чём между ними разница.',
                ky: 'Пол үчүн жабуу тандап жатканда, керектөөчүлөр барган сайын жаңы материал — SPC-ламинат менен кезигишүүдө. Бул заманбап материал классикалык ламинатка жакшы альтернатива болуп саналат. Алардын айырмасын карап чыгалы.'
            },
            seoTitle: {
                ru: "Тестовый пост №1 | Линия роста",
                ky: "Тесттик пост №1 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №1. Полезная информация и свежие новости.",
                ky: "Тесттик пост №1ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img3.jpg',
                    alt: {
                        ru: "Новость 1",
                        ky: "Жаңылык 1"
                    }
                },
                {
                    image: 'test/news-img2.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 1"
                    },
                },
                {
                    image: 'test/news-img7.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                }
            ],
        },
        {
            title: {
                ru: '5 причин выбрать натяжной потолок для квартиры',
                ky: 'Батирге тартма шып тандаш үчүн 5 себеп'
            },
            description: {
                ru: 'Почему всё больше людей выбирают натяжные потолки, а не краску или гипсокартон? Текст поста: Натяжные потолки давно перестали быть экзотикой. Сегодня это доступное, стильное и функциональное решение для любого интерьера. Вот 5 причин, почему они вам точно подойдут.',
                ky: 'Эмне үчүн барган сайын көп адамдар шыпты боёонун же гипсокартондун ордуна тартма шыптарды тандашат? Тартма шыптар буга чейин эле экзотика болуудан калган. Бүгүнкү күндө бул арзан, заманбап жана функционалдуу чечим. Төмөндө бул шыптарды тандоого 5 негизги себеп бар.'
            },
            seoTitle: {
                ru: "Тестовый пост №2 | Линия роста",
                ky: "Тесттик пост №2 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №2. Полезная информация и свежие новости.",
                ky: "Тесттик пост №2ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img8.jpg',
                    alt: {
                        ru: "Новость 2",
                        ky: "Жаңылык 2"
                    }
                },
                {
                    image: 'test/news-img4.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Тестируем SPC-ламинат на влагу — выдержит ли пролив?',
                ky: 'SPC-ламинатты нымдуулукка сынайбыз — суу төгүлсө чыдайбы?'
            },
            description: {
                ru: 'Текст поста:\nОбычный ламинат "боится воды", и это давно известно. Но как насчёт SPC-ламината? Проведём простой тест:\n\nЭксперимент:\nНа SPC-плиту вылили стакан воды и оставили на 2 часа. После — вытерли и осмотрели.\n\n🔹 Результат:\n— никаких вздутий,\n— никаких пятен,\n— замки не размокли,\n— цвет не изменился.',
                ky: 'Кадимки ламинат сууга чыдабайт — бул баарына белгилүү. А SPC-ламинатчы? Жөнөкөй тест жүргүзөбүз:\n\nЭксперимент:\nSPC-плитага бир стакан суу төгүлүп, 2 саатка калтырылды. Андан кийин сүртүлүп, текшерилди.\n\n🔹 Натыйжа:\n— ириңдөө жок,\n— тактар жок,\n— кулпулар чирибеди,\n— түсү өзгөргөн жок.'
            },
            seoTitle: {
                ru: "Тестовый пост №3 | Линия роста",
                ky: "Тесттик пост №3 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №3. Полезная информация и свежие новости.",
                ky: "Тесттик пост №3ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img2.jpg',
                    alt: {
                        ru: "Новость 3",
                        ky: "Жаңылык 3"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Как устанавливают натяжной потолок — шаг за шагом',
                ky: 'Тартма шыпты кантип орнотушат — кадам-кадам менен'
            },
            description: {
                ru: 'Показываем, как проходит монтаж: быстро, чисто и без лишнего шума.\n\nТекст поста:\nЕсли вы ещё не видели, как монтируется натяжной потолок — сейчас расскажем. Это занимает всего 3–5 часов и не требует глобального ремонта.',
                ky: 'Монтаж кандай өтөрүн көрсөтөбүз: тез, таза жана ызы-чуусуз.\n\nЭгер сиз тартма шып кандай орнотуларын көрө элек болсоңуз — азыр айтып беребиз. Бул процесс 3–5 сааттан ашпайт жана ири оңдоону талап кылбайт.'
            },
            seoTitle: {
                ru: "Тестовый пост №4 | Линия роста",
                ky: "Тесттик пост №4 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №4. Полезная информация и свежие новости.",
                ky: "Тесттик пост №4ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img6.jpg',
                    alt: {
                        ru: "Новость 4",
                        ky: "Жаңылык 4"
                    }
                },
                {
                    image: 'test/news-img6.jpg',
                    alt: {
                        ru: "Новость 4",
                        ky: "Жаңылык 4"
                    }
                },
                {
                    image: 'test/news-img9.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Как сочетать натяжной потолок и SPC-ламинат — дизайнерские советы',
                ky: 'Тартма шып менен SPC-ламинатты кантип айкалыштырса болот — дизайнерден кеңештер'
            },
            description: {
                ru: 'Расскажем, как выбрать цвета и фактуры, чтобы пол и потолок выглядели гармонично.\n\nТекст поста:\n\nПравильное сочетание пола и потолка — это не просто красиво, но и влияет на восприятие пространства. Вот несколько дизайнерских комбинаций:',
                ky: 'Пол менен шыпты туура түстө жана текстурада айкалыштырып, гармониялуу интерьер түзүүнү үйрөтөбүз.\n\nПол менен шыптын туура айкалышы — бул жөн эле кооздук эмес, ал мейкиндикти кабылдоого да таасир берет. Төмөндө бир нече дизайнердик сунуштар берилет.'
            },
            seoTitle: {
                ru: "Тестовый пост №5 | Линия роста",
                ky: "Тесттик пост №5 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №5. Полезная информация и свежие новости.",
                ky: "Тесттик пост №5ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img1.jpg',
                    alt: {
                        ru: "Новость 5",
                        ky: "Жаңылык 5"
                    }
                },
                {
                    image: 'test/news-img7.jpg',
                    alt: {
                        ru: "Доп изображение 1",
                        ky: "Кошумча сүрөт 1"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Что выбрать для пола — SPC-ламинат или обычный?',
                ky: 'Пол үчүн эмнени тандоо керек — SPC-ламинатпы же кадимкиби?'
            },
            description: {
                ru: 'Выбирая напольное покрытие, всё чаще покупатели сталкиваются с новым вариантом — SPC-ламинат. Это современный материал, который становится отличной альтернативой классическому ламинату. Разберёмся, в чём между ними разница.',
                ky: 'Пол үчүн жабуу тандап жатканда, керектөөчүлөр барган сайын жаңы материал — SPC-ламинат менен кезигишүүдө. Бул заманбап материал классикалык ламинатка жакшы альтернатива болуп саналат. Алардын айырмасын карап чыгалы.'
            },
            images: [
                {
                    image: 'test/news-img3.jpg',
                    alt: {
                        ru: "Новость 1",
                        ky: "Жаңылык 1"
                    }
                },
                {
                    image: 'test/news-img2.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 1"
                    },
                },
                {
                    image: 'test/news-img7.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                }
            ],
        },
        {
            title: {
                ru: '5 причин выбрать натяжной потолок для квартиры',
                ky: 'Батирге тартма шып тандаш үчүн 5 себеп'
            },
            description: {
                ru: 'Почему всё больше людей выбирают натяжные потолки, а не краску или гипсокартон? Текст поста: Натяжные потолки давно перестали быть экзотикой. Сегодня это доступное, стильное и функциональное решение для любого интерьера. Вот 5 причин, почему они вам точно подойдут.',
                ky: 'Эмне үчүн барган сайын көп адамдар шыпты боёонун же гипсокартондун ордуна тартма шыптарды тандашат? Тартма шыптар буга чейин эле экзотика болуудан калган. Бүгүнкү күндө бул арзан, заманбап жана функционалдуу чечим. Төмөндө бул шыптарды тандоого 5 негизги себеп бар.'
            },
            images: [
                {
                    image: 'test/news-img8.jpg',
                    alt: {
                        ru: "Новость 2",
                        ky: "Жаңылык 2"
                    }
                },
                {
                    image: 'test/news-img4.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Тестируем SPC-ламинат на влагу — выдержит ли пролив?',
                ky: 'SPC-ламинатты нымдуулукка сынайбыз — суу төгүлсө чыдайбы?'
            },
            description: {
                ru: 'Текст поста:\nОбычный ламинат "боится воды", и это давно известно. Но как насчёт SPC-ламината? Проведём простой тест:\n\nЭксперимент:\nНа SPC-плиту вылили стакан воды и оставили на 2 часа. После — вытерли и осмотрели.\n\n🔹 Результат:\n— никаких вздутий,\n— никаких пятен,\n— замки не размокли,\n— цвет не изменился.',
                ky: 'Кадимки ламинат сууга чыдабайт — бул баарына белгилүү. А SPC-ламинатчы? Жөнөкөй тест жүргүзөбүз:\n\nЭксперимент:\nSPC-плитага бир стакан суу төгүлүп, 2 саатка калтырылды. Андан кийин сүртүлүп, текшерилди.\n\n🔹 Натыйжа:\n— ириңдөө жок,\n— тактар жок,\n— кулпулар чирибеди,\n— түсү өзгөргөн жок.'
            },
            images: [
                {
                    image: 'test/news-img2.jpg',
                    alt: {
                        ru: "Новость 3",
                        ky: "Жаңылык 3"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Как устанавливают натяжной потолок — шаг за шагом',
                ky: 'Тартма шыпты кантип орнотушат — кадам-кадам менен'
            },
            description: {
                ru: 'Показываем, как проходит монтаж: быстро, чисто и без лишнего шума.\n\nТекст поста:\nЕсли вы ещё не видели, как монтируется натяжной потолок — сейчас расскажем. Это занимает всего 3–5 часов и не требует глобального ремонта.',
                ky: 'Монтаж кандай өтөрүн көрсөтөбүз: тез, таза жана ызы-чуусуз.\n\nЭгер сиз тартма шып кандай орнотуларын көрө элек болсоңуз — азыр айтып беребиз. Бул процесс 3–5 сааттан ашпайт жана ири оңдоону талап кылбайт.'
            },
            images: [
                {
                    image: 'test/news-img6.jpg',
                    alt: {
                        ru: "Новость 4",
                        ky: "Жаңылык 4"
                    }
                },
                {
                    image: 'test/news-img6.jpg',
                    alt: {
                        ru: "Новость 4",
                        ky: "Жаңылык 4"
                    }
                },
                {
                    image: 'test/news-img9.jpg',
                    alt: {
                        ru: "Доп изображение 2",
                        ky: "Кошумча сүрөт 2"
                    }
                },
            ],
        },
        {
            title: {
                ru: 'Как сочетать натяжной потолок и SPC-ламинат — дизайнерские советы',
                ky: 'Тартма шып менен SPC-ламинатты кантип айкалыштырса болот — дизайнерден кеңештер'
            },
            description: {
                ru: 'Расскажем, как выбрать цвета и фактуры, чтобы пол и потолок выглядели гармонично.\n\nТекст поста:\n\nПравильное сочетание пола и потолка — это не просто красиво, но и влияет на восприятие пространства. Вот несколько дизайнерских комбинаций:',
                ky: 'Пол менен шыпты туура түстө жана текстурада айкалыштырып, гармониялуу интерьер түзүүнү үйрөтөбүз.\n\nПол менен шыптын туура айкалышы — бул жөн эле кооздук эмес, ал мейкиндикти кабылдоого да таасир берет. Төмөндө бир нече дизайнердик сунуштар берилет.'
            },
            seoTitle: {
                ru: "Тестовый пост №6 | Линия роста",
                ky: "Тесттик пост №6 | Линия роста"
            },
            seoDescription: {
                ru: "Читайте тестовый пост №6. Полезная информация и свежие новости.",
                ky: "Тесттик пост №6ти окуңуз. Пайдалуу маалымат жана жаңылыктар."
            },
            images: [
                {
                    image: 'test/news-img1.jpg',
                    alt: {
                        ru: "Новость 5",
                        ky: "Жаңылык 5"
                    }
                },
                {
                    image: 'test/news-img7.jpg',
                    alt: {
                        ru: "Доп изображение 1",
                        ky: "Кошумча сүрөт 1"
                    }
                },
            ],
        },
    ]);


    await PortfolioItem.create([
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            },
            seoTitle: {
                ru: "Проект №1 — Галерея | Линия роста",
                ky: "№1 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №1 — современный интерьер с натяжными потолками.",
                ky: "№1 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
            cover: 'test/IMG_2683.jpg',
            coverAlt: {ru: 'Обложка проекта 2', ky: 'Долбоордун мукабасы 2'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
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
            seoTitle: {
                ru: "Проект №2 — Галерея | Линия роста",
                ky: "№2 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №2 — современный интерьер с натяжными потолками.",
                ky: "№2 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            seoTitle: {
                ru: "Проект №3 — Галерея | Линия роста",
                ky: "№3 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №3 — современный интерьер с натяжными потолками.",
                ky: "№3 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
            cover: 'test/IMG_2682.jpg',
            coverAlt: {ru: 'Обложка проекта 4', ky: 'Долбоордун мукабасы 4'},
            gallery: [
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
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
            seoTitle: {
                ru: "Проект №4 — Галерея | Линия роста",
                ky: "№4 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №4 — современный интерьер с натяжными потолками.",
                ky: "№4 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
            cover: 'test/IMG_2682.jpg',
            coverAlt: {ru: 'Обложка проекта 6', ky: 'Долбоордун мукабасы 6'},
            gallery: [
                {image: 'test/IMG_2683.jpg', alt: {ru: 'Галерея 1', ky: 'Галерея 1'}},
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
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
            seoTitle: {
                ru: "Проект №6 — Галерея | Линия роста",
                ky: "№6 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №6 — современный интерьер с натяжными потолками.",
                ky: "№6 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            seoTitle: {
                ru: "Проект №7 — Галерея | Линия роста",
                ky: "№7 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №7 — современный интерьер с натяжными потолками.",
                ky: "№7 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            },
            seoTitle: {
                ru: "Проект №1 — Галерея | Линия роста",
                ky: "№1 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №1 — современный интерьер с натяжными потолками.",
                ky: "№1 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            seoTitle: {
                ru: "Проект №9 — Галерея | Линия роста",
                ky: "№9 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №9 — современный интерьер с натяжными потолками.",
                ky: "№9 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
            cover: 'test/IMG_2682.jpg',
            coverAlt: {ru: 'Обложка проекта 10', ky: 'Долбоордун мукабасы 10'},
            gallery: [
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
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
            seoTitle: {
                ru: "Проект №10 — Галерея | Линия роста",
                ky: "№10 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №10 — современный интерьер с натяжными потолками.",
                ky: "№10 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
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
            },
            seoTitle: {
                ru: "Проект №1 — Галерея | Линия роста",
                ky: "№1 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №1 — современный интерьер с натяжными потолками.",
                ky: "№1 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
        {
            title: {
                ru: "Гостинная",
                ky: "Конок бөлмө"
            },
            cover: 'test/IMG_2682.jpg',
            coverAlt: {ru: 'Обложка проекта 10', ky: 'Долбоордун мукабасы 10'},
            gallery: [
                {image: 'test/IMG_2682.jpg', alt: {ru: 'Галерея 2', ky: 'Галерея 2'}},
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
            seoTitle: {
                ru: "Проект №10 — Галерея | Линия роста",
                ky: "№10 долбоор — Галерея | Линия роста"
            },
            seoDescription: {
                ru: "Посмотрите фотографии проекта №10 — современный интерьер с натяжными потолками.",
                ky: "№10 долбоордун сүрөттөрүн караңыз — заманбап чоюлма шыптар менен интерьер."
            }
        },
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
        {
            name: "Нурбек",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 1",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 2",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 3",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 5",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 6",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 7",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 8",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 10",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 11",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек 12",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек13",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек14",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек15",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек16",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек17",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек18",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек19",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек20",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек21",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек22",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек23",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек24",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек25",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек26",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек27",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек28",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек29",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек30",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек31",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
            isArchived: false
        },
        {
            name: "Нурбек32",
            phone: "+996555123456",
            email: 'nurbek@gmail.com',
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
            clientName: "Настя",
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
            clientName: "Алексей",
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
            clientName: "Айбек",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "Айбек",
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
            clientName: "Адилет",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "Адилет",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },
        {
            clientName: "Алмаз",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "Алмаз",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "Каныкей",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "Каныкей",
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
            clientName: "Егор",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "Егор",
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
            clientName: "Николай",
            adminId: null,
            status: "Без ответа",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            messages: [
                {
                    sender: "client",
                    senderName: "Николай",
                    text: "Алло? Вы здесь?",
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3 + 1000 * 60 * 3),
                },
            ],
        },

        {
            clientName: "Султан",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "Султан",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "Николай",
            adminId: Alice,
            status: "В работе",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
            messages: [
                {
                    sender: "client",
                    senderName: "Николай",
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
            clientName: "Полина",
            adminId: Bob,
            status: "Завершена",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
            messages: [
                {
                    sender: "client",
                    senderName: "Полина",
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
            clientName: "Сезим",
            adminId: Bob,
            status: "Новый",
            createdAt: new Date(),
            messages: [
                {
                    sender: "client",
                    senderName: "Сезим",
                    text: "Здравствуйте, хочу узнать подробнее.",
                    timestamp: new Date(),
                },
            ],
        },
        {
            clientName: "Аселя",
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

    console.log('Counts:', {
        users: await User.countDocuments(),
        categories: await Category.countDocuments(),
        products: await Product.countDocuments(),
        posts: await Post.countDocuments(),
        portfolioItems: await PortfolioItem.countDocuments(),
        requests: await RequestFromClient.countDocuments(),
        contacts: await Contact.countDocuments(),
        services: await Service.countDocuments(),
        chatSessions: await ChatSession.countDocuments(),
    });

    await mongoose.disconnect();
    console.log('✅ Seed done');
    process.exit(0);
}


run().catch(console.error);