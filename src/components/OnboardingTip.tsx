import { useState } from 'react';
import { useLang } from '../i18n';

export default function OnboardingTip() {
  const { t } = useLang();
  const [visible, setVisible] = useState(() => !localStorage.getItem('tip-seen'));

  function dismiss() {
    localStorage.setItem('tip-seen', '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 84, right: 16, zIndex: 1100,
      background: '#1f2937', color: 'white', borderRadius: 12,
      padding: '10px 14px', maxWidth: 220, fontSize: 13, lineHeight: 1.5,
      boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
    }}>
      {/* Arrow pointing to FAB */}
      <div style={{
        position: 'absolute', bottom: -8, right: 16,
        width: 0, height: 0,
        borderLeft: '8px solid transparent',
        borderRight: '8px solid transparent',
        borderTop: '8px solid #1f2937',
      }} />
      <p style={{ margin: '0 0 8px' }}>{t.addMissingTip}</p>
      <button onClick={dismiss} style={{
        background: '#6366f1', color: 'white', border: 'none',
        borderRadius: 6, padding: '4px 12px', fontSize: 12,
        fontWeight: 600, cursor: 'pointer',
      }}>
        {t.gotIt}
      </button>
    </div>
  );
}
