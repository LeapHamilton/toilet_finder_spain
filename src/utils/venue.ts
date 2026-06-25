import type { VenueType } from '../types';

export const VENUE_ICON: Record<VenueType, string> = {
  toilet:      '🚻',
  fast_food:   '🍔',
  restaurant:  '🍽️',
  cafe:        '☕',
  fuel:        '⛽',
  supermarket: '🛒',
  mall:        '🛍️',
};

export const VENUE_LABEL_EN: Record<VenueType, string> = {
  toilet:      'Public toilet',
  fast_food:   'Fast food',
  restaurant:  'Restaurant',
  cafe:        'Café',
  fuel:        'Petrol station',
  supermarket: 'Supermarket',
  mall:        'Shopping centre',
};

export const VENUE_LABEL_ES: Record<VenueType, string> = {
  toilet:      'Aseo público',
  fast_food:   'Comida rápida',
  restaurant:  'Restaurante',
  cafe:        'Cafetería',
  fuel:        'Gasolinera',
  supermarket: 'Supermercado',
  mall:        'Centro comercial',
};
