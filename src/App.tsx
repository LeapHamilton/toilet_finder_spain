import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Toilet, ViewMode } from './types';
import { fetchNearbyToilets } from './api/overpass';
import { haversineMetres } from './utils/geo';
import { useLang } from './i18n';
import ToiletMap from './components/ToiletMap';
import ToiletList from './components/ToiletList';
import ToiletDetail from './components/ToiletDetail';
import FilterBar, { type Filters } from './components/FilterBar';
import OnboardingTip from './components/OnboardingTip';
import './App.css';

type Status = 'idle' | 'locating' | 'loading' | 'ready' | 'error';

const CACHE_KEY = 'last-search';

function App() {
  const { lang, t, setLang } = useLang();
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [userPos, setUserPos] = useState<{ lat: number; lon: number } | null>(null);
  const [toilets, setToilets] = useState<Toilet[]>([]);
  const [selected, setSelected] = useState<Toilet | null>(null);
  const [view, setView] = useState<ViewMode>('map');
  const [radius, setRadius] = useState(1500);
  const [filters, setFilters] = useState<Filters>({ free: false, wheelchair: false, changing: false, venuesOnly: false });

  const locate = useCallback(async (r = radius) => {
    setStatus('locating');
    setErrorMsg('');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        setUserPos({ lat, lon });
        setStatus('loading');
        try {
          const raw = await fetchNearbyToilets(lat, lon, r);
          const withDist = raw
            .map((t_) => ({ ...t_, distance: haversineMetres(lat, lon, t_.lat, t_.lon) }))
            .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));
          setToilets(withDist);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ lat, lon, toilets: withDist }));
          setStatus('ready');
        } catch {
          // Try to load from cache
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const { toilets: ct } = JSON.parse(cached);
            setToilets(ct);
            setStatus('ready');
          } else {
            setStatus('error');
            setErrorMsg(t.errorLoad);
          }
        }
      },
      (err) => {
        // Try cache on error
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { lat, lon, toilets: ct } = JSON.parse(cached);
          setUserPos({ lat, lon });
          setToilets(ct);
          setStatus('ready');
          return;
        }
        setStatus('error');
        setErrorMsg(err.code === 1 ? t.errorPermission : t.errorGps);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [radius, t]);

  useEffect(() => { locate(); }, []);

  // Re-fetch when radius changes (after first load)
  function handleRadiusChange(r: number) {
    setRadius(r);
    if (status === 'ready') locate(r);
  }

  const filtered = useMemo(() => toilets.filter((t_) => {
    if (filters.free && t_.fee !== 'no') return false;
    if (filters.wheelchair && t_.wheelchair !== 'yes') return false;
    if (filters.changing && t_.changing_table !== 'yes') return false;
    if (filters.venuesOnly && t_.venueType !== 'toilet') return false;
    return true;
  }), [toilets, filters]);

  const nearest = filtered[0] ?? null;

  if (status === 'idle' || status === 'locating' || status === 'loading') {
    return (
      <div className="splash">
        <div className="splash-icon">🚻</div>
        <h1>{t.appName}</h1>
        <p>{status === 'locating' ? t.locating : status === 'loading' ? t.loading : ''}</p>
        <div className="spinner" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="splash">
        <div className="splash-icon">⚠️</div>
        <h1>{t.error}</h1>
        <p>{errorMsg}</p>
        <button className="btn-primary" onClick={() => locate()}>{t.retry}</button>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <span className="header-title">🚻 {t.appName}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="header-count">{t.found(filtered.length)}</span>
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            style={{
              background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white',
              borderRadius: 6, padding: '3px 8px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {lang === 'es' ? 'EN' : 'ES'}
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <FilterBar
        filters={filters}
        onChange={setFilters}
        radius={radius}
        onRadiusChange={handleRadiusChange}
      />

      {/* View toggle */}
      <div className="tab-bar">
        <button className={`tab ${view === 'map' ? 'tab--active' : ''}`} onClick={() => setView('map')}>
          {t.map}
        </button>
        <button className={`tab ${view === 'list' ? 'tab--active' : ''}`} onClick={() => setView('list')}>
          {t.list}
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {view === 'map' && userPos ? (
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <ToiletMap
              userLat={userPos.lat}
              userLon={userPos.lon}
              toilets={filtered}
              selected={selected}
              onSelect={setSelected}
            />
            {selected && <ToiletDetail toilet={selected} onClose={() => setSelected(null)} />}
          </div>
        ) : (
          <ToiletList
            toilets={filtered}
            selected={selected}
            onSelect={(t_) => { setSelected(t_); setView('map'); }}
            onExpandRadius={() => handleRadiusChange(Math.min(radius + 1000, 5000))}
          />
        )}
      </div>

      {/* Navigate to nearest */}
      {nearest && (
        <a
          className="nearest-btn"
          href={`https://www.google.com/maps/dir/?api=1&destination=${nearest.lat},${nearest.lon}&travelmode=walking`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t.nearestToilet}
        </a>
      )}

      {/* FABs */}
      <button className="fab" onClick={() => locate()} title={t.refresh}>🔄</button>
      {userPos && (
        <a
          className="fab fab--add"
          href={`https://www.openstreetmap.org/edit?editor=id#map=18/${userPos.lat}/${userPos.lon}`}
          target="_blank"
          rel="noopener noreferrer"
          title={t.addMissing}
        >
          ➕
        </a>
      )}

      <OnboardingTip />
    </div>
  );
}

export default App;
