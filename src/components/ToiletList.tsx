import type { Toilet } from '../types';
import { formatDistance } from '../utils/geo';
import { getOpenStatus } from '../utils/openingHours';
import { useLang } from '../i18n';

interface Props {
  toilets: Toilet[];
  selected: Toilet | null;
  onSelect: (t: Toilet) => void;
  onExpandRadius: () => void;
}

export default function ToiletList({ toilets, selected, onSelect, onExpandRadius }: Props) {
  const { t } = useLang();

  if (toilets.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#6b7280' }}>
        <div style={{ fontSize: 48 }}>🔍</div>
        <p style={{ margin: '12px 0 20px' }}>{t.noResults}</p>
        <button onClick={onExpandRadius} style={{
          background: '#6366f1', color: 'white', border: 'none',
          padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          {t.expandRadius}
        </button>
      </div>
    );
  }

  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      {toilets.map((t_) => {
        const isSelected = selected?.id === t_.id;
        const openStatus = getOpenStatus(t_.opening_hours);
        return (
          <div key={t_.id} onClick={() => onSelect(t_)} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '14px 16px', borderBottom: '1px solid #f3f4f6',
            background: isSelected ? '#eef2ff' : 'white', cursor: 'pointer',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: isSelected ? '#6366f1' : '#f3f4f6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, flexShrink: 0,
            }}>🚻</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {t_.name ?? t.publicToilet}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {t_.distance != null && <span>{formatDistance(t_.distance)}</span>}
                {openStatus === 'open' && <span style={{ color: '#166534', fontWeight: 600 }}>● {t.openNow}</span>}
                {openStatus === 'closed' && <span style={{ color: '#991b1b', fontWeight: 600 }}>● {t.closedNow}</span>}
                {t_.wheelchair === 'yes' && <span>♿</span>}
                {t_.fee === 'no' && <span>{t.free}</span>}
                {t_.fee === 'yes' && <span>💶</span>}
              </div>
            </div>
            <div style={{ color: '#9ca3af', fontSize: 18 }}>›</div>
          </div>
        );
      })}
    </div>
  );
}
