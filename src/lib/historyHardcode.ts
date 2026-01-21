// src/lib/historyHardcode.ts

const KEY = "csignes_activity_days_v1"; // ["YYYY-MM-DD", ...]

// helper
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getActivityDays(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(arr) ? arr.filter(Boolean) : [];
  } catch {
    return [];
  }
}

// (اختياري) استعملها انت وقت تكمّل لعبة/درس (اذا بدك)
export function markActivityToday() {
  const t = todayKey();
  const days = getActivityDays();
  if (!days.includes(t)) {
    days.push(t);
    localStorage.setItem(KEY, JSON.stringify(days));
  }
}

function startOfWeekMondayLocal(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday start
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function buildHistoryWeekHardcoded() {
  const labels = ["L", "M", "M", "J", "V", "S", "D"];
  const start = startOfWeekMondayLocal(new Date());
  const today = todayKey();
  const set = new Set(getActivityDays());

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);

    return {
      date: key,
      label: labels[i],
      didActivity: set.has(key),
      isToday: key === today,
    };
  });

  const activeDaysCount = days.filter((d) => d.didActivity).length;

  // streak: consecutive days ending today
  let streakDays = 0;
  const cur = new Date();
  cur.setHours(0, 0, 0, 0);

  while (true) {
    const k = cur.toISOString().slice(0, 10);
    if (!set.has(k)) break;
    streakDays++;
    cur.setDate(cur.getDate() - 1);
  }

  // "progression globale" hardcode:
  // 0% اذا ما في نشاط، 10% اذا في نشاط (بس لتبين تتحرك)
  const globalProgressPct = set.size > 0 ? 10 : 0;

  // achievements inputs
  const activeDaysTotal = set.size;

  return { days, activeDaysCount, streakDays, globalProgressPct, activeDaysTotal };
}
