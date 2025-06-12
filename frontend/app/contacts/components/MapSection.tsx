const MapSection = () => {
    return (
        <section aria-labelledby="map-heading" lang="ru">
            <h2 id="map-heading" className="text-xl font-semibold mb-4 text-gray-900">
                Наше местоположение
            </h2>
            <div className="w-full h-[300px] rounded-xl overflow-hidden">
                <iframe
                    src="https://www.openstreetmap.org/export/embed.html?bbox=74.619%2C42.887%2C74.628%2C42.892&layer=mapnik&marker=42.890104%2C74.623837"
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Карта местоположения Линии Роста"
                />
            </div>
        </section>
    );
};

export default MapSection;
