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
    feeWarning: '⚠️ Este aseo tiene tarifa — lleva monedas o tarjeta.',
    free: 'Gratuito',
    freeConfirmed: '✅ Entrada gratuita',
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
    filterWheelchair: 'Accesible',
    filterChanging: 'Cambiador',
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
    fee: '💶 Paid entry',
    feeWarning: '⚠️ This toilet charges a fee — bring coins or a card.',
    free: 'Free',
    freeConfirmed: '✅ Free entry',
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
    filterWheelchair: 'Accessible',
    filterChanging: 'Baby change',
    allFilters: 'All',
    openHours: (h: string) => h,
  },
};

export type Strings = typeof strings.es;

const LangContext = createContext<{ lang: Lang; t: Strings; setLang: (l: Lang) => void }>({
  lang: 'en',
  t: strings.en,
  setLang: () => {},
});

function detectLang(): Lang {
  const saved = localStorage.getItem('lang') as Lang | null;
  if (saved === 'es' || saved === 'en') return saved;
  // Auto-detect from browser language
  const browserLang = navigator.language?.toLowerCase() ?? '';
  return browserLang.startsWith('es') ? 'es' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

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
