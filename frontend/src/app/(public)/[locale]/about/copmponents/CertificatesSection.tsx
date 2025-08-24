import React from "react";
import {FileText} from "lucide-react";
import {getTranslations} from "next-intl/server";

const CertificatesSection = async () => {
    const t = await getTranslations("AboutPage");

    const wallpaperCertificates = [
        {title: "Обои тканые КМ1", file: "/certificates/wallpaper/ОБОИ тканые КМ1.pdf"},
        {title: "Протокол испытаний", file: "/certificates/wallpaper/протокол испытаний.pdf"},
        {title: "Сертификат соответствия", file: "/certificates/wallpaper/Сертификат соответствия.pdf"},
        {title: "Эко сертификат", file: "/certificates/wallpaper/Эко сертификат.pdf"},
        {
            title: "Экспертное заключение на нетканой основе",
            file: "/certificates/wallpaper/Экспертное заключение на нетканой основе_page-0001.pdf"
        },
        {
            title: "Экспертное заключение на тканой основе",
            file: "/certificates/wallpaper/Экспертное заключение на тканой основе_page-0001.pdf"
        },
    ];

    const filmCertificates = [{
        title: "Тесты на плёнку RoHS",
        file: "/certificates/film/1_RoHS_тесты бессрочный.pdf"
    },
        {title: "Тесты на плёнку EN71", file: "/certificates/film/2_EN71-3_тесты бессрочный.pdf"},
        {
        title: "ГОСТ Р ИСО",
        file: "/certificates/film/3_ГОСТ Р ИСО_Актуальный.pdf"
    }, {
        title: "Сертификат соответствия MSD Ideal Home Prestige и Evo КМ3",
        file: "/certificates/film/12_Сертификат_соответствия_MSD_Ideal_Home_Prestige_и_Evo_КМ3_до_27.pdf"
    },
        {title: "REACH", file: "/certificates/film/REACH.PDF"},
        {
        title: "Пожарная декларация",
        file: "/certificates/film/ПОЖАРНАЯ ДЕКЛАРАЦИЯ до 28г..pdf"
    },
        {title: "ЭКО", file: "/certificates/film/4_ЭКО_актуальный.pdf"},
        {
        title: "Сертификат MSD CLassic Profi Standart",
        file: "/certificates/film/2_сертификат  MSD CLassic Profi Standart_Актуальный.pdf"
    },
        {title: "A+", file: "/certificates/film/5_A+ Актуальный.pdf"},
        {
        title: "Арталикс Идеал",
        file: "/certificates/film/8_Арталикс Идеал.pdf"
    },
        {
        title: "РОСЭКОАРТАЛИКС",
        file: "/certificates/film/10_РОСЭКОАРТАЛИКС_Актуальный.pdf"
    },
        {
        title: "Сертификат соответствия MSD Ideal Home IDEAL КМ4",
        file: "/certificates/film/11_Сертификат_соответствия_MSD_Ideal_Home_IDEAL_КМ4_до_27_03_2027.pdf"
    },
    ];

    return (
        <section className="py-16 mb-10 md:mb-20">
            <div className="space-y-16">
                <h2 className="text-23-30-1_5 font-bold text-center border-b-highlight w-max mx-auto">
                    {t("CertificatesTitle")}
                </h2>

                <div>
                    <h3 className="text-18-28-1_2 mb-6 text-center">{t("WallpaperCertsTitle")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {wallpaperCertificates.map((cert, i) => (
                            <a
                                key={i}
                                href={cert.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-6 border rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="hidden sm:block w-6 h-6 text-primary"/>
                                    <span className="font-medium">{cert.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">PDF</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-18-28-1_2 mb-6 text-center">{t("FilmCertsTitle")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filmCertificates.map((cert, i) => (
                            <a
                                key={i}
                                href={cert.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-6 border rounded-xl shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="hidden sm:block w-6 h-6 text-primary"/>
                                    <span className="font-medium">{cert.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">PDF</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CertificatesSection;