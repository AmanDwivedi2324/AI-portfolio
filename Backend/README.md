# Portfolio CRM API

Express 5 + MongoDB backend that stores every piece of content shown on the
portfolio site and powers the admin panel at `/admin` on the frontend.

## Run it locally

```bash
npm install
cp .env.example .env          # then fill in MONGO_URI and JWT_SECRET
npm run seed                  # load the initial content (skips filled collections)
npm run admin:create -- --username aman --password "a long passphrase"
npm run dev                   # http://localhost:5000
```

The frontend dev server proxies `/api` and `/uploads` here (see `Frontend/vite.config.js`).

| Script | What it does |
| --- | --- |
| `npm run dev` / `npm start` | API with / without auto-restart |
| `npm run seed` | Load `data/seedContent.js` into empty collections. `-- --force` replaces all content (never users or messages) |
| `npm run admin:create` | Create the admin, or reset their password (signs out other sessions) |
| `npm test` | End-to-end API tests on a throwaway local DB (`TEST_MONGO_URI` to override) |

## Structure

```
server.js              start-up, DB connection, graceful shutdown
app.js                 Express app: security headers, CORS, rate limits, routes, errors
config/                validated env (env.js), MongoDB, Cloudinary
models/                Mongoose schemas (+ plugins/orderable: order + visible)
validators/            zod schemas for every request body
middleware/            auth, validation, uploads, rate limits, error handler
controllers/           request handlers (crud.controller.js serves 5 collections)
routes/                /api routes; admin.route.js mounts the protected CRM
services/              public portfolio payload + cache, file storage, JWT
scripts/               seed + admin CLI
tests/                 API tests (node:test)
```

## API

Public
- `GET /api/health`
- `GET /api/portfolio` — everything the site renders, visible items only
- `POST /api/contact` — `{ name, email, message }` (5 per hour per IP)
- `POST /api/auth/login` — `{ username, password }` → `{ token }` (10 tries / 15 min)

Admin (header `Authorization: Bearer <token>`)
- `GET /api/auth/me`, `PUT /api/auth/password`
- `GET /api/admin/dashboard`
- `GET|PUT /api/admin/profile`
- `/api/admin/{projects|skills|experience|education|process}` — `GET`, `POST`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `PATCH /reorder { ids }`
- `GET /api/admin/messages?status=all|unread|read`, `PATCH /:id { read }`, `DELETE /:id`
- `POST /api/admin/uploads?kind=image|document` — multipart field `file`; images ≤ 5 MB (JPG/PNG/WebP/AVIF), PDF ≤ 10 MB; the real file type is checked, not just the name

Errors always look like `{ "error": { "message": "...", "details": [{ "path", "message" }] } }`.

## Deploying (Render + Vercel)

1. Render → Environment: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` (32+ chars),
   `CORS_ORIGINS=https://<your-vercel-domain>`, and the three `CLOUDINARY_*` values
   (local uploads are wiped on every Render deploy).
2. From your machine, with `MONGO_URI` pointing at Atlas, run `npm run seed -- --force`
   once (the old site's documents don't match the new models) and `npm run admin:create`.
3. Vercel → Environment: `VITE_API_URL=https://<your-render-service>.onrender.com`, then redeploy.
4. Optional: ping `/api/health` every 10 minutes (e.g. UptimeRobot) so the free Render
   instance doesn't sleep; the site falls back to cached content after 8 s otherwise.
