export type VenueType = 'toilet' | 'fast_food' | 'restaurant' | 'cafe' | 'fuel' | 'supermarket' | 'mall';

export interface Toilet {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  wheelchair?: 'yes' | 'no' | 'limited';
  fee?: 'yes' | 'no';
  opening_hours?: string;
  changing_table?: 'yes' | 'no';
  distance?: number;
  venueType: VenueType;
}

export type ViewMode = 'map' | 'list';
