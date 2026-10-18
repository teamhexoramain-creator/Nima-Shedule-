/* Runs every minute (UTC cron). For every phone with alerts on: task alerts (lead time from its settings),
   plus the morning (8:40, earlier on Saturdays) and 11:45 pm summaries. Uses that phone's own edits / moved / added tasks. */
import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import { dueTasks, payloadFor, planOf, doneOf, settingsOf, summaryDue, summaryPayload, colomboDate, dedupeKey } from '../lib/reminders.mjs';
import { getVapid, subject } from '../lib/vapid.mjs';

export default async () => {
  const now = Date.now();
  const store = getStore({ name: 'push', consistency: 'strong' });
  const { blobs } = await store.list({ prefix: 'subs/' });
  if (!blobs.length) return;
  const v = await getVapid(store);
  webpush.setVapidDetails(subject(), v.publicKey, v.privateKey);
  const today = colomboDate(now);

  for (const { key } of blobs) {
    const id = key.slice('subs/'.length);
    const rec = await store.get(key, { type: 'json' });
    if (!rec || !rec.sub) continue;
    const set = settingsOf(rec);
    let PLAN;
    try { PLAN = planOf(rec); } catch (e) { console.error('plan failed', id, e); continue; }
    const done = doneOf(rec);
    const sentSet = new Set((await store.get(`sent/${id}`, { type: 'json' })) || []);
    const jobs = [];

    for (const item of dueTasks(now, PLAN, set)) {
      const dk = dedupeKey(item.task);
      if (done.has(item.task.id) || sentSet.has(dk)) continue;
      jobs.push({ dk, payload: payloadFor(item), ttl: 600 });
    }
    const kind = summaryDue(now, set, PLAN);
    if (kind) {
      const dk = `sum:${kind}:${today}`;
      if (!sentSet.has(dk)) jobs.push({ dk, payload: summaryPayload(kind, now, PLAN, rec), ttl: 3600 });
    }

    let changed = false;
    for (const j of jobs) {
      try {
        await webpush.sendNotification(rec.sub, JSON.stringify(j.payload), { TTL: j.ttl, urgency: 'high' });
        sentSet.add(j.dk); changed = true;
      } catch (err) {
        if (err && (err.statusCode === 404 || err.statusCode === 410)) {
          await store.delete(key); await store.delete(`sent/${id}`); changed = false; break; // phone gone
        }
        console.error('push failed', id, err && err.statusCode, err && err.body);
      }
    }
    if (changed) await store.setJSON(`sent/${id}`, [...sentSet].slice(-500));
  }
};

export const config = { schedule: '* * * * *' };
