/* /api/push — the app's link to the alert server.
   GET                                             → { publicKey } for subscribing
   POST {subscription?, endpoint?, done?, test?}   save / update, optionally send a test alert
   DELETE {endpoint}                               turn alerts off for that phone */
import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
import { createHash } from 'node:crypto';
import { getVapid, subject } from '../lib/vapid.mjs';

const idFor = endpoint => createHash('sha256').update(endpoint).digest('hex').slice(0, 40);
const json = (body, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

export default async (req) => {
  try {
    const store = getStore({ name: 'push', consistency: 'strong' });

    if (req.method === 'GET') {
      const v = await getVapid(store);
      return json({ publicKey: v.publicKey });
    }

    let body;
    try { body = await req.json(); } catch { return json({ error: 'JSON body එකක් ඕන.' }, 400); }

    const endpoint = body.subscription?.endpoint || body.endpoint;
    if (typeof endpoint !== 'string' || !endpoint.startsWith('https://')) {
      return json({ error: 'Push subscription එක හරි නෑ.' }, 400);
    }
    const id = idFor(endpoint);
    const key = `subs/${id}`;

    if (req.method === 'DELETE') {
      await store.delete(key);
      await store.delete(`sent/${id}`);
      return json({ ok: true, removed: true });
    }

    const existing = (await store.get(key, { type: 'json' })) || {};
    const sub = body.subscription || existing.sub;
    if (!sub || !sub.keys) return json({ error: 'මේ phone එකට alerts on කරලා නෑ.' }, 404);
    const done = Array.isArray(body.done) ? body.done.filter(x => typeof x === 'string').slice(0, 2000) : (existing.done || []);
    await store.setJSON(key, { sub, done, updated: Date.now() });

    if (body.test) {
      const v = await getVapid(store);
      webpush.setVapidDetails(subject(), v.publicKey, v.privateKey);
      try {
        await webpush.sendNotification(sub, JSON.stringify({
          title: 'Nima Schedule alerts on ✓',
          body: 'හැම වැඩකටම විනාඩි 10කට කලින් මෙහෙම alert එකක් එනවා.',
          tag: 'nima-test',
          url: '/',
        }), { TTL: 300, urgency: 'high' });
      } catch (err) {
        const code = err?.statusCode;
        if (code === 401 || code === 403) {
          // subscription was made with an old key: the app should re-subscribe
          await store.delete(key);
          return json({ ok: false, resubscribe: true, error: 'Push key එක මාරු වෙලා. ආයේ subscribe කරනවා.' }, 409);
        }
        return json({ ok: false, error: `Test alert එක යැව්වේ නෑ (${code || err?.message || 'error'}).` }, 502);
      }
      return json({ ok: true, id, testSent: true });
    }
    return json({ ok: true, id });
  } catch (err) {
    console.error('api/push failed', err);
    return json({ error: `Server error: ${err?.message || err}` }, 500);
  }
};

export const config = { path: '/api/push', method: ['GET', 'POST', 'DELETE'] };
