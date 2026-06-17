import type { Toilet } from '../types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export async function fetchNearbyToilets(lat: number, lon: number, radiusMetres = 1500): Promise<Toilet[]> {
  const query = `
    [out:json][timeout:25];
    node["amenity"="toilets"](around:${radiusMetres},${lat},${lon});
    out body;
  `;

  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!res.ok) throw new Error('Overpass API request failed');

  const json = await res.json();

  return (json.elements as any[]).map((el) => ({
    id: el.id,
    lat: el.lat,
    lon: el.lon,
    name: el.tags?.name,
    wheelchair: el.tags?.wheelchair,
    fee: el.tags?.fee,
    opening_hours: el.tags?.opening_hours,
    changing_table: el.tags?.changing_table,
  }));
}
