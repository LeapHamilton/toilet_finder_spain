import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { Toilet } from '../types';
import { formatDistance } from '../utils/geo';
import { useLang } from '../i18n';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userIcon = L.divIcon({
  className: '',
  html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 2px #3b82f6"></div>`,
  iconAnchor: [8, 8],
});

const toiletIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;background:#ffffff;border:2px solid #6366f1;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 6px rgba(0,0,0,0.25)">🚻</div>`,
  iconAnchor: [16, 16],
});

const selectedIcon = L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;background:#6366f1;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 8px rgba(99,102,241,0.6)">🚻</div>`,
  iconAnchor: [18, 18],
});

interface Props {
  userLat: number;
  userLon: number;
  toilets: Toilet[];
  selected: Toilet | null;
  onSelect: (t: Toilet) => void;
}

export default function ToiletMap({ userLat, userLon, toilets, selected, onSelect }: Props) {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const clusterRef = useRef<L.MarkerClusterGroup | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current).setView([userLat, userLon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);
    L.marker([userLat, userLon], { icon: userIcon })
      .addTo(mapRef.current)
      .bindPopup(t.appName);
    clusterRef.current = L.markerClusterGroup({ maxClusterRadius: 50 });
    mapRef.current.addLayer(clusterRef.current);
  }, []);

  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;
    cluster.clearLayers();
    markersRef.current.clear();

    toilets.forEach((toilet) => {
      const isSelected = selected?.id === toilet.id;
      const marker = L.marker([toilet.lat, toilet.lon], { icon: isSelected ? selectedIcon : toiletIcon })
        .bindTooltip(
          `${toilet.name ?? t.publicToilet}${toilet.distance != null ? ` · ${formatDistance(toilet.distance)}` : ''}`,
          { permanent: false, direction: 'top' }
        )
        .on('click', () => onSelect(toilet));
      markersRef.current.set(toilet.id, marker);
      cluster.addLayer(marker);
    });
  }, [toilets, selected]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selected) return;
    map.setView([selected.lat, selected.lon], Math.max(map.getZoom(), 16), { animate: true });
    markersRef.current.forEach((m, id) => m.setIcon(id === selected.id ? selectedIcon : toiletIcon));
  }, [selected]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
