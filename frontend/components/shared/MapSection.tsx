'use client';

import {useEffect, useRef} from 'react';
import 'leaflet/dist/leaflet.css';

const MapSection = () => {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null); // Храним карту, чтобы избежать повторной инициализации

    useEffect(() => {
        const loadMap = async () => {
            try {
                const L = await import('leaflet');

                if (leafletMapRef.current) {
                    leafletMapRef.current.remove();
                }

                if (!mapRef.current) return;

                const map = L.map(mapRef.current).setView([42.890104, 74.623837], 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; OpenStreetMap contributors',
                }).addTo(map);

                const markerIcon = L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                });

                L.marker([42.890104, 74.623837], {icon: markerIcon})
                    .addTo(map)
                    .bindPopup('<b>Наше местоположение</b><br>г. Бишкек, ул. Куренкеева, 49');

                leafletMapRef.current = map;
            } catch (error) {
                console.error('Ошибка загрузки карты:', error);
            }
        };

        loadMap();

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
            }
        };
    }, []);

    return (
        <section aria-labelledby="map-heading" lang="ru">
            <h2 id="map-heading" className="text-xl font-semibold mb-4 text-gray-900">
                Наше местоположение
            </h2>
            <div
                ref={mapRef}
                className="w-full h-[600px] rounded-xl overflow-hidden"
                aria-label="Где находится Линия роста: г. Бишкек, ул. Куренкеева, 49"
            />
        </section>
    );
};

export default MapSection;