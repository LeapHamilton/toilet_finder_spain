import { useLang } from '../i18n';

export interface Filters {
  free: boolean;
  wheelchair: boolean;
  changing: boolean;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  radius: number;
  onRadiusChange: (r: number) => void;
}

export default function FilterBar({ filters, onChange, radius, onRadiusChange }: Props) {
  const { t } = useLang();

  function toggle(key: keyof Filters) {
    onChange({ ...filters, [key]: !filters[key] });
  }

  const chip = (active: boolean, label: string, onClick: () => void) => (
    <button onClick={onClick} style={{
      padding: '5px 12px', borderRadius: 999, fontSize: 13, fontWeight: 600,
      border: `1.5px solid ${active ? '#6366f1' : '#e5e7eb'}`,
      background: active ? '#eef2ff' : 'white',
      color: active ? '#6366f1' : '#6b7280',
      cursor: 'pointer', whiteSpace: 'nowrap',
    }}>
      {label}
    </button>
  );

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb', padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
        {chip(filters.free, `💶 ${t.filterFree}`, () => toggle('free'))}
        {chip(filters.wheelchair, `♿ ${t.filterWheelchair === '♿' ? (t as any).wheelchair ?? 'Accessible' : t.filterWheelchair}`, () => toggle('wheelchair'))}
        {chip(filters.changing, `👶 ${t.filterChanging === '👶' ? (t as any).changingTable ?? 'Baby change' : t.filterChanging}`, () => toggle('changing'))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap', minWidth: 80 }}>
          {t.radius(radius / 1000)}
        </span>
        <input
          type="range" min={500} max={5000} step={500} value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          style={{ flex: 1, accentColor: '#6366f1' }}
        />
      </div>
    </div>
  );
}
