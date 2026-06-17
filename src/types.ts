export interface Toilet {
  id: number;
  lat: number;
  lon: number;
  name?: string;
  wheelchair?: 'yes' | 'no' | 'limited';
  fee?: 'yes' | 'no';
  opening_hours?: string;
  changing_table?: 'yes' | 'no';
  distance?: number; // metres, calculated client-side
}

export type ViewMode = 'map' | 'list';
