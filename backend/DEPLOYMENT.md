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

## S3 storage (STORAGE_BACKEND=s3)

Optional - local disk storage is the default and needs none of this. If you
switch to S3:

- The bucket must allow public read for media/article assets via a **bucket
  policy** (not an object ACL - `storage_service.py` deliberately never sets
  one, since AWS buckets created since ~April 2023 default to Block Public
  Access with ACLs disabled, and an ACL PUT on such a bucket fails outright).
  A minimal policy: allow `s3:GetObject` for principal `*` on
  `arn:aws:s3:::<bucket>/media/*` and `arn:aws:s3:::<bucket>/articles/*`.
  Leave `resumes/*` out of that policy entirely - résumés must stay private.
- Existing files uploaded under `STORAGE_BACKEND=local` are **not**
  automatically migrated to S3 if you switch later - `resume_path`/`path`
  values already in the database still point at local disk paths, and
  `fetch_resume`/`delete_resume`/`delete_article_file` branch purely on the
  *current* `STORAGE_BACKEND`, not on where a given file actually lives. Only
  flip the switch before any real uploads happen, or migrate existing files
  and update their DB rows to S3 keys/URLs first.

## Secret scanning

CI runs `gitleaks` on every push/PR (`.github/workflows/ci.yml`) to catch a
committed secret before it reaches a public history. If you want the same
check locally before you even push, install the
[gitleaks pre-commit hook](https://github.com/gitleaks/gitleaks#pre-commit)
via `pre-commit` - optional, since CI already catches it, but it fails
faster.
