import { createContext, useContext, useState, type ReactNode } from 'react';

export type Lang = 'es' | 'en';

const strings = {
  es: {
    appName: 'Aseos Cercanos',
    locating: 'Obteniendo tu ubicación…',
    loading: 'Buscando aseos cercanos…',
    error: 'Error',
    retry: 'Reintentar',
    errorGps: 'No se pudo obtener tu ubicación. Comprueba el GPS.',
    errorPermission: 'Permiso de ubicación denegado. Actívalo en la configuración del navegador.',
    errorLoad: 'No se pudo cargar la información de aseos. Inténtalo de nuevo.',
    found: (n: number) => `${n} encontrado${n === 1 ? '' : 's'}`,
    map: '🗺️ Mapa',
    list: '📋 Lista',
    noResults: 'No se han encontrado aseos cercanos.',
    expandRadius: 'Ampliar radio de búsqueda',
    publicToilet: 'Aseo público',
    wheelchair: '♿ Accesible',
    fee: '💶 De pago',
    free: 'Gratuito',
    changingTable: '👶 Cambiador',
    directions: '🧭 Cómo llegar',
    distance: (d: string) => `📍 ${d} de distancia`,
    openNow: 'Abierto ahora',
    closedNow: 'Cerrado',
    hoursUnknown: 'Horario desconocido',
    nearestToilet: '🚀 Ir al más cercano',
    refresh: 'Actualizar',
    addMissing: 'Añadir aseo que falta',
    addMissingTip: '¿Falta un aseo? Toca ➕ para añadirlo en OpenStreetMap.',
    gotIt: 'Entendido',
    radius: (km: number) => `Radio: ${km} km`,
    filterFree: 'Gratuito',
    filterWheelchair: '♿',
    filterChanging: '👶',
    allFilters: 'Todo',
    openHours: (h: string) => h,
  },
  en: {
    appName: 'Nearby Toilets',
    locating: 'Getting your location…',
    loading: 'Searching for nearby toilets…',
    error: 'Error',
    retry: 'Try again',
    errorGps: 'Could not get your location. Check your GPS.',
    errorPermission: 'Location permission denied. Enable it in your browser settings.',
    errorLoad: 'Could not load toilet data. Please try again.',
    found: (n: number) => `${n} found`,
    map: '🗺️ Map',
    list: '📋 List',
    noResults: 'No toilets found nearby.',
    expandRadius: 'Expand search radius',
    publicToilet: 'Public toilet',
    wheelchair: '♿ Accessible',
    fee: '💶 Paid',
    free: 'Free',
    changingTable: '👶 Baby change',
    directions: '🧭 Get directions',
    distance: (d: string) => `📍 ${d} away`,
    openNow: 'Open now',
    closedNow: 'Closed',
    hoursUnknown: 'Hours unknown',
    nearestToilet: '🚀 Go to nearest',
    refresh: 'Refresh',
    addMissing: 'Add missing toilet',
    addMissingTip: 'Missing a toilet? Tap ➕ to add it on OpenStreetMap.',
    gotIt: 'Got it',
    radius: (km: number) => `Radius: ${km} km`,
    filterFree: 'Free',
    filterWheelchair: '♿',
    filterChanging: '👶',
    allFilters: 'All',
    openHours: (h: string) => h,
  },
};

export type Strings = typeof strings.es;

const LangContext = createContext<{ lang: Lang; t: Strings; setLang: (l: Lang) => void }>({
  lang: 'es',
  t: strings.es,
  setLang: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const saved = (localStorage.getItem('lang') as Lang) ?? 'es';
  const [lang, setLangState] = useState<Lang>(saved);

  function setLang(l: Lang) {
    localStorage.setItem('lang', l);
    setLangState(l);
  }

  return (
    <LangContext.Provider value={{ lang, t: strings[lang], setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
