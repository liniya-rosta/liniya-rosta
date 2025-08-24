import React from "react";
import { FileText } from "lucide-react";
import {getTranslations} from "next-intl/server";

const CertificatesSection = async () => {
    const t =  await getTranslations("AboutPage");

    const wallpaperCertificates = [
        {
            title: t("WallpaperCert1"),
            file: "/certificates/wallpaper/ОБОИ тканые КМ1.pdf",
        },
        {
            title: t("WallpaperCert2"),
            file: "/certificates/wallpaper/протокол испытаний.pdf",
        },
        {
            title: t("WallpaperCert3"),
            file: "/certificates/wallpaper/Сертификат соответствия.pdf",
        },
        {
            title: t("WallpaperCert4"),
            file: "/certificates/wallpaper/Эко сертификат.pdf",
        },
        {
            title: t("WallpaperCert5"),
            file: "/certificates/wallpaper/Экспертное заключение на нетканой основе_page-0001.pdf",
        },
        {
            title: t("WallpaperCert6"),
            file: "/certificates/wallpaper/Экспертное заключение на тканой основе_page-0001.pdf",
        },
    ];

    const filmCertificates = [
        { title: t("FilmCert1"), file: "/certificates/film/1_RoHS_тесты бессрочный.pdf" },
        { title: t("FilmCert2"), file: "/certificates/film/2_EN71-3_тесты бессрочный.pdf" },
        { title: t("FilmCert3"), file: "/certificates/film/3_ГОСТ Р ИСО_Актуальный.pdf" },
        { title: t("FilmCert4"), file: "/certificates/film/12_Сертификат_соответствия_MSD_Ideal_Home_Prestige_и_Evo_КМ3_до_27.pdf" },
        { title: t("FilmCert5"), file: "/certificates/film/REACH.PDF" },
        { title: t("FilmCert6"), file: "/certificates/film/ПОЖАРНАЯ ДЕКЛАРАЦИЯ до 28г..pdf" },
        { title: t("FilmCert7"), file: "/certificates/film/4_ЭКО_актуальный.pdf" },
        { title: t("FilmCert8"), file: "/certificates/film/2_сертификат  MSD CLassic Profi Standart_Актуальный.pdf" },
        { title: t("FilmCert9"), file: "/certificates/film/5_A+ Актуальный.pdf" },
        { title: t("FilmCert10"), file: "/certificates/film/8_Арталикс Идеал.pdf" },
        { title: t("FilmCert11"), file: "/certificates/film/10_РОСЭКОАРТАЛИКС_Актуальный.pdf" },
        { title: t("FilmCert12"), file: "/certificates/film/11_Сертификат_соответствия_MSD_Ideal_Home_IDEAL_КМ4_до_27_03_2027.pdf" },
    ];

    return (
        <section className="py-16">
            <div className="space-y-16">
                <h2 className="text-3xl font-bold text-center">{t("CertificatesTitle")}</h2>

                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">{t("WallpaperCertsTitle")}</h3>
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
                                    <FileText className="w-6 h-6 text-primary" />
                                    <span className="font-medium">{cert.title}</span>
                                </div>
                                <span className="text-sm text-gray-500">PDF</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div>
                    <h3 className="text-2xl font-semibold mb-6 text-center">{t("FilmCertsTitle")}</h3>
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
                                    <FileText className="w-6 h-6 text-primary" />
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