/* /api/sync — link devices with a code.  GET ?code=  → { state, ts }   PUT { code, state, ts } */
import { getStore } from '@netlify/blobs';

const json = (b, s = 200) => Response.json(b, { status: s, headers: { 'cache-control': 'no-store' } });
const norm = c => String(c || '').toUpperCase().replace(/[^A-Z2-9]/g, '');

export default async (req) => {
  try {
    const store = getStore({ name: 'sync', consistency: 'strong' });
    if (req.method === 'GET') {
      const code = norm(new URL(req.url).searchParams.get('code'));
      if (code.length !== 12) return json({ error: 'Code එක හරි නෑ.' }, 400);
      const rec = await store.get(`c/${code}`, { type: 'json' });
      if (!rec) return json({ error: 'ඒ code එක හොයාගන්න බෑ.' }, 404);
      return json({ state: rec.state, ts: rec.ts || 0 });
    }
    let body; try { body = await req.json(); } catch { return json({ error: 'JSON body එකක් ඕන.' }, 400); }
    const code = norm(body.code);
    if (code.length !== 12) return json({ error: 'Code එක හරි නෑ.' }, 400);
    if (!body.state || typeof body.state !== 'object') return json({ error: 'State එකක් නෑ.' }, 400);
    const text = JSON.stringify(body.state);
    if (text.length > 600000) return json({ error: 'Data ගොඩක් ලොකුයි.' }, 413);
    const old = await store.get(`c/${code}`, { type: 'json' });
    const ts = +body.state.ts || Date.now();
    if (old && (old.ts || 0) > ts) return json({ ok: true, kept: 'remote', ts: old.ts }); // never overwrite newer data
    await store.setJSON(`c/${code}`, { state: body.state, ts, updated: Date.now() });
    return json({ ok: true, ts });
  } catch (err) {
    console.error('api/sync failed', err);
    return json({ error: `Server error: ${err?.message || err}` }, 500);
  }
};

export const config = { path: '/api/sync', method: ['GET', 'PUT'] };
