/* Which alerts to send right now, and what they say. Pure logic (no Netlify / web-push imports). */
import { makePlan, SUBJ, KIND, ORDER, START, END, PLAN_V, isoAdd, mins, dayKey, dayStat, streakInfo, startMin } from './plan.mjs';

const OFFSET_MS = 5.5 * 60 * 60 * 1000; // Sri Lanka (UTC+05:30, no DST)
export const DEFAULTS = { lead: 10, cls: false, rest: false, am: true, pm: true };
export const AM_MIN = 8 * 60 + 40;   // 8:40 morning summary (wakes 8:30) — earlier when the day starts earlier (Saturday 7:30 class)
export const PM_MIN = 23 * 60 + 45;  // 11:45 pm night summary (sleeps ~1:00)

export const colomboDate = nowMs => new Date(nowMs + OFFSET_MS).toISOString().slice(0, 10);
export const colomboMin = nowMs => { const d = new Date(nowMs + OFFSET_MS); return d.getUTCHours() * 60 + d.getUTCMinutes(); };
export const settingsOf = rec => Object.assign({}, DEFAULTS, (rec && rec.settings) || {});
/* A phone that last synced with an older plan version: its edits / ticks point at the old task order, so ignore them. */
export const freshRec = rec => (rec && rec.pv === PLAN_V);
export const planOf = rec => freshRec(rec)
  ? makePlan({ edits: rec.edits, hidden: rec.hidden, custom: rec.custom }).PLAN
  : makePlan({ custom: (rec && rec.custom || []).filter(c => c && c.date >= START && c.date <= END) }).PLAN;
export const doneOf = rec => new Set(freshRec(rec) ? (rec.done || []) : []);
/** When the morning summary goes out today: 8:40, or 50 minutes before the first timed task if that is earlier. */
export function amMinFor(PLAN, today) {
  const P = PLAN && PLAN[today];
  const first = P ? P.tasks.filter(t => t.ap && t.e && t.k !== 'rest').map(startMin).sort((a, b) => a - b)[0] : undefined;
  return first === undefined ? AM_MIN : Math.max(5 * 60 + 30, Math.min(AM_MIN, first - 50));
}

export function taskStartMs(task) {
  const [y, m, d] = task.date.split('-').map(Number);
  return Date.UTC(y, m - 1, d, 0, 0) + startMin(task) * 60000 - OFFSET_MS;
}
export const dedupeKey = t => `${t.id}@${t.date}${t.t}${t.ap}`;

/** Tasks starting within the person's lead time. */
export function dueTasks(nowMs, PLAN, set) {
  set = Object.assign({}, DEFAULTS, set || {});
  const windowMs = (set.lead + 0.5) * 60000;
  const today = colomboDate(nowMs), out = [];
  for (const d of [today, isoAdd(today, 1)]) {
    if (!PLAN[d]) continue;
    for (const t of PLAN[d].tasks) {
      if (!t.ap || !t.e) continue;
      if (t.k === 'rest' && !set.rest) continue;
      if (set.cls && t.k !== 'cls') continue;
      const left = taskStartMs(t) - nowMs;
      if (left > 0 && left <= windowMs) out.push({ task: t, minutesLeft: Math.max(1, Math.round(left / 60000)) });
    }
  }
  return out;
}

const AP = { am: 'පෙ.ව.', pm: 'ප.ව.' };
export function payloadFor({ task, minutesLeft }) {
  const s = SUBJ[task.s] || { n: '' };
  const kind = KIND[task.k] ? ` · ${KIND[task.k]}` : '';
  return { title: `විනාඩි ${minutesLeft}කින් · ${s.n}`, body: `${task.t} ${AP[task.ap] || ''} – ${task.ti}${kind}`, tag: task.id, url: '/?tab=today' };
}

/** Which summary (if any) is due: 'am' from 8:40 (earlier on early days), 'pm' from 11:45 (catches up if a minute was missed). */
export function summaryDue(nowMs, set, PLAN) {
  set = Object.assign({}, DEFAULTS, set || {});
  const m = colomboMin(nowMs), am = PLAN ? amMinFor(PLAN, colomboDate(nowMs)) : AM_MIN;
  if (set.am && m >= am && m < am + 90) return 'am';
  if (set.pm && m >= PM_MIN && m < 24 * 60) return 'pm';
  return null;
}
const hrs = h => `${Math.round(h * 2) / 2}`;
export function summaryPayload(kind, nowMs, PLAN, rec) {
  const today = colomboDate(nowMs), done = doneOf(rec), doneObj = Object.fromEntries([...done].map(k => [k, 1]));
  const open = (rec.qs || []).length;
  if (kind === 'am') {
    const P = PLAN[today];
    if (!P) return { title: 'සුභ උදෑසනක්', body: 'අද plan එකේ වැඩ නෑ.', tag: 'nima-am', url: '/?tab=today' };
    const work = P.tasks.filter(t => !t.fx && t.k !== 'rest');
    const first = work.find(t => !done.has(t.id)) || work[0];
    const cls = P.tasks.filter(t => t.k === 'cls');
    const sk = streakInfo(PLAN, doneObj, today);
    const parts = [`වැඩ ${work.length}ක් · පැය ${hrs(P.tasks.filter(t => t.k !== 'rest').reduce((a, t) => a + t.h, 0))}ක්`];
    if (first) parts.push(`පළමුවෙන්: ${first.t} ${AP[first.ap] || ''} ${first.ti}`);
    if (cls.length && open) parts.push(`ගුරුවරයාගෙන් අහන්න ප්‍රශ්න ${open}ක් තියෙනවා`);
    if (sk.cur) parts.push(`🔥 ${sk.cur}`);
    return { title: `සුභ උදෑසනක් · ${dayKey(today)[0]}`, body: parts.join(' · '), tag: 'nima-am', url: '/?tab=today' };
  }
  const st = PLAN[today] ? dayStat(PLAN, today, doneObj) : { n: 0, a: 0, p: 0 };
  const sk = streakInfo(PLAN, doneObj, today);
  const tm = isoAdd(today, 1), TP = PLAN[tm];
  const nxt = TP && TP.tasks.find(t => !t.fx && t.k !== 'rest');
  const parts = [`අද ${st.a}/${st.n} ඉවරයි (${Math.round(st.p * 100)}%)`];
  if (sk.cur) parts.push(`🔥 ${sk.cur} දවස් පිට පිට`);
  if (nxt) parts.push(`හෙට: ${nxt.t} ${AP[nxt.ap] || ''} ${nxt.ti}`);
  return { title: st.p >= 0.6 ? 'අද දවස නියමයි 👏' : 'අද දවස ඉවර වෙන්න ළඟයි', body: parts.join(' · '), tag: 'nima-pm', url: '/?tab=progress' };
}
