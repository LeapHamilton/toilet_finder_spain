export type OpenStatus = 'open' | 'closed' | 'unknown';

export function getOpenStatus(opening_hours?: string): OpenStatus {
  if (!opening_hours) return 'unknown';
  if (opening_hours.trim().toLowerCase() === '24/7') return 'open';

  try {
    const now = new Date();
    const dayIndex = now.getDay(); // 0=Sun,1=Mon,...,6=Sat
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const dayMap: Record<string, number[]> = {
      Mo: [1], Tu: [2], We: [3], Th: [4], Fr: [5], Sa: [6], Su: [0],
      'Mo-Fr': [1, 2, 3, 4, 5],
      'Mo-Sa': [1, 2, 3, 4, 5, 6],
      'Mo-Su': [0, 1, 2, 3, 4, 5, 6],
      'Sa-Su': [6, 0],
    };

    // Match patterns like "Mo-Fr 08:00-20:00" or "Mo-Su 09:00-21:00; PH off"
    const segments = opening_hours.split(';');
    for (const seg of segments) {
      const match = seg.trim().match(/^([A-Za-z\-,\s]+)\s+(\d{2}:\d{2})-(\d{2}:\d{2})/);
      if (!match) continue;
      const [, dayPart, openStr, closeStr] = match;
      const days = dayMap[dayPart.trim()];
      if (!days || !days.includes(dayIndex)) continue;
      const toMins = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
      };
      const open = toMins(openStr);
      const close = toMins(closeStr);
      return currentMins >= open && currentMins < close ? 'open' : 'closed';
    }
  } catch {
    // fall through
  }
  return 'unknown';
}
