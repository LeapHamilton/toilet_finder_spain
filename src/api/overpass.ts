import type { Toilet, VenueType } from '../types';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function venueTypeFromTags(tags: Record<string, string>): VenueType {
  if (tags.amenity === 'toilets') return 'toilet';
  if (tags.amenity === 'fast_food') return 'fast_food';
  if (tags.amenity === 'restaurant') return 'restaurant';
  if (tags.amenity === 'cafe') return 'cafe';
  if (tags.amenity === 'fuel') return 'fuel';
  if (tags.shop === 'supermarket') return 'supermarket';
  if (tags.shop === 'mall') return 'mall';
  return 'toilet';
}

export async function fetchNearbyToilets(lat: number, lon: number, radiusMetres = 1500): Promise<Toilet[]> {
  const around = `(around:${radiusMetres},${lat},${lon})`;
  const query = `
    [out:json][timeout:30];
    (
      node["amenity"="toilets"]${around};
      node["amenity"="fast_food"]["toilets"="yes"]${around};
      node["amenity"="restaurant"]["toilets"="yes"]${around};
      node["amenity"="cafe"]["toilets"="yes"]${around};
      node["amenity"="fuel"]["toilets"="yes"]${around};
      node["shop"="supermarket"]["toilets"="yes"]${around};
      node["shop"="mall"]["toilets"="yes"]${around};
    );
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
    venueType: venueTypeFromTags(el.tags ?? {}),
  }));
}
