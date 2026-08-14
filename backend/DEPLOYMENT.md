# Deployment

## Start command

Production runs under gunicorn (already in `requirements.txt`), never the
Flask dev server (`run.py` is for local development only - see the comment
in that file about why it deliberately doesn't touch production).

```
gunicorn -w 1 -b 0.0.0.0:5000 "app:create_app()"
```

`-w 1` (a single worker) is the current recommendation, not a placeholder -
see the two reasons below. If you need more than one worker for throughput,
resolve both first:

- **Rate limiting** (`RATELIMIT_STORAGE_URI`): defaults to `memory://`, which
  keeps counters per-process. With N workers, a "5 requests per 15 minutes"
  limit effectively becomes `5 × N`. Provision Redis and set
  `RATELIMIT_STORAGE_URI=redis://...` before running more than one worker.
- **Calendly sync scheduler** (`app/services/calendly_sync_scheduler.py`):
  starts once per worker process. With N workers, N schedulers poll Calendly
  independently (harmless today since upserts are idempotent, but wasteful
  and counts against Calendly's API rate limit N times over).

## Required environment variables

Copy `.env.example`, fill in real values, and do not commit the result.
`config/settings.py`'s `get_config()` will now refuse to start under
`FLASK_ENV=production` if any of these are still at their dev-only default:

- `SECRET_KEY`, `JWT_SECRET_KEY` - must not be the fallback placeholder values.
- `FRONTEND_URL` - must not contain `localhost` (it's embedded in newsletter
  unsubscribe links and email images).
- `CORS_ORIGINS` - must not contain a `localhost`/private-IP origin.

Everything else that must be set explicitly for production (database
credentials, storage backend, email provider, Calendly token) is listed in
`.env.example`'s comments.

## Secret scanning

CI runs `gitleaks` on every push/PR (`.github/workflows/ci.yml`) to catch a
committed secret before it reaches a public history. If you want the same
check locally before you even push, install the
[gitleaks pre-commit hook](https://github.com/gitleaks/gitleaks#pre-commit)
via `pre-commit` - optional, since CI already catches it, but it fails
faster.
