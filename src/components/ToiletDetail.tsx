import type { Toilet } from '../types';
import { formatDistance } from '../utils/geo';
import { getOpenStatus } from '../utils/openingHours';
import { useLang } from '../i18n';

interface Props {
  toilet: Toilet;
  onClose: () => void;
}

function Badge({ label, ok }: { label: string; ok: boolean | null }) {
  if (ok === null) return null;
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 12,
      fontWeight: 600, background: ok ? '#dcfce7' : '#fee2e2',
      color: ok ? '#166534' : '#991b1b', marginRight: 4, marginBottom: 4,
    }}>
      {label}
    </span>
  );
}

export default function ToiletDetail({ toilet, onClose }: Props) {
  const { t } = useLang();
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${toilet.lat},${toilet.lon}&travelmode=walking`;
  const openStatus = getOpenStatus(toilet.opening_hours);

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white',
      borderRadius: '16px 16px 0 0', boxShadow: '0 -4px 24px rgba(0,0,0,0.15)',
      padding: '16px 20px 32px', zIndex: 1000, maxHeight: '55vh', overflowY: 'auto',
    }}>
      <div onClick={onClose} style={{
        width: 40, height: 4, background: '#e5e7eb', borderRadius: 2,
        margin: '0 auto 16px', cursor: 'pointer',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 24, marginBottom: 4 }}>🚻</div>
          <h2 style={{ margin: 0, fontSize: 18, color: '#111827' }}>
            {toilet.name ?? t.publicToilet}
          </h2>
          {toilet.distance != null && (
            <p style={{ margin: '4px 0 0', fontSize: 14, color: '#6b7280' }}>
              {t.distance(formatDistance(toilet.distance))}
            </p>
          )}
        </div>
        <button onClick={onClose} style={{
          border: 'none', background: '#f3f4f6', borderRadius: '50%',
          width: 32, height: 32, cursor: 'pointer', fontSize: 16, lineHeight: '32px', textAlign: 'center',
        }}>✕</button>
      </div>

      {/* Open/closed badge */}
      <div style={{ margin: '10px 0 4px' }}>
        {openStatus === 'open' && (
          <span style={{ background: '#dcfce7', color: '#166534', padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            ✅ {t.openNow}
          </span>
        )}
        {openStatus === 'closed' && (
          <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 10px', borderRadius: 999, fontSize: 13, fontWeight: 600 }}>
            🔴 {t.closedNow}
          </span>
        )}
      </div>

      {/* Prominent fee warning */}
      {toilet.fee === 'yes' && (
        <div style={{
          margin: '10px 0 4px', padding: '10px 14px', borderRadius: 10,
          background: '#fff7ed', border: '1.5px solid #f97316', color: '#9a3412',
          fontSize: 14, fontWeight: 600,
        }}>
          {t.feeWarning}
        </div>
      )}
      {toilet.fee === 'no' && (
        <div style={{
          margin: '10px 0 4px', padding: '10px 14px', borderRadius: 10,
          background: '#f0fdf4', border: '1.5px solid #22c55e', color: '#166534',
          fontSize: 14, fontWeight: 600,
        }}>
          {t.freeConfirmed}
        </div>
      )}

      <div style={{ margin: '10px 0' }}>
        <Badge label={t.wheelchair} ok={toilet.wheelchair === 'yes' ? true : toilet.wheelchair === 'no' ? false : null} />
        <Badge label={t.changingTable} ok={toilet.changing_table === 'yes' ? true : toilet.changing_table === 'no' ? false : null} />
      </div>

      {toilet.opening_hours && (
        <p style={{ margin: '0 0 12px', fontSize: 14, color: '#374151' }}>
          🕐 {t.openHours(toilet.opening_hours)}
        </p>
      )}

      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" style={{
        display: 'block', textAlign: 'center', background: '#6366f1', color: 'white',
        padding: '12px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15,
      }}>
        {t.directions}
      </a>
    </div>
  );
}
