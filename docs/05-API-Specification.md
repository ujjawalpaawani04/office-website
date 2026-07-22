# Complete API Specification
## Singh Amit & Associates — REST API (Public + Admin)

| | |
|---|---|
| **Document Version** | 1.0 |
| **Base URL (dev)** | `http://localhost:5000/api` (`VITE_API_BASE_URL` in `frontend/.env`) |
| **Format** | JSON (`application/json`), except file uploads (`multipart/form-data`) |
| **Auth scheme (admin)** | `Authorization: Bearer <JWT access token>` — **not yet implemented**, specified here for the Admin Panel build |
| **Status legend** | 🟢 LIVE (implemented, verified against source) · 🔵 PLANNED (specified here, not yet built) |

This specification documents the **17 live public endpoints exactly as implemented** (verified against `backend/app/blueprints/*/routes.py`, `backend/app/routes/*.py`, `backend/app/controllers/*.py`, `backend/app/validators/*.py`) and specifies the **full Admin Panel API surface** required to satisfy Document 1 (SRS) and Document 2 (Admin Panel Planning). Where the live implementation's actual behavior differs from the original audit sketch (e.g., validation failures return **400**, not 422; field names are `phone`/`service`/`message`, not `mobile`/`subject`/`cover_letter`), **the live behavior below is authoritative.**

---

## 1. Global Conventions

- All responses are JSON. Error responses use the shape `{"error": "<message>"}` or, for field-level validation failures, `{"error": "Validation failed", "fields": {"<field>": "<message>"}}`.
- Centralized error handlers (`backend/app/middleware/error_handlers.py`) cover **400, 404, 413, 429, 500** uniformly across the entire API — every error the API can produce comes back in this shape, and 500s are logged server-side with a traceback that is never exposed to the caller.
- CORS is restricted to the origins in `CORS_ORIGINS` (env-configured), scoped to `/api/*`, with `supports_credentials=True` (required for the refresh-token cookie once auth ships).
- Rate limiting (Flask-Limiter, Redis-backed via `RATELIMIT_STORAGE_URI`) is already applied per-route; each endpoint's table below states its actual limit.
- No endpoint today requires authentication — the entire live surface is public. Auth and Admin sections below are additive.

---

## 2. Public Endpoints — 🟢 LIVE

### 2.1 Health
| | |
|---|---|
| **Endpoint** | `GET /api/health` |
| **Auth** | None |
| **Response 200** | `{"status": "ok"}` |

### 2.2 Blog — `blog_bp`, prefix `/api/blog`

#### `GET /api/blog/posts` 🟢
- **Purpose:** List all published posts.
- **Auth:** None. **Query params:** none today (no `?page=`/`?category=`/`?q=` yet — see §5.1 Gap Note).
- **Response 200:** JSON array of post objects:
```json
[{
  "id": 1, "slug": "essential-income-tax-planning-strategies",
  "title": "Essential Income Tax Planning Strategies",
  "category": "Tax Planning", "tags": ["Income Tax", "Planning"],
  "author": "CA Amit Singh", "authorRole": "Managing Partner",
  "publishDate": "2026-07-10", "readingTime": 8,
  "featuredImage": "/media/blog/xyz.jpg",
  "summary": "...", "content": "<p>...</p>",
  "keyTakeaways": ["..."], "faqs": [{"question": "...", "answer": "..."}]
}]
```
- **Errors:** none defined (always 200 with possibly empty array).

#### `GET /api/blog/posts/<slug>` 🟢
- **Purpose:** Full detail for one published post.
- **Response 200:** single post object (shape above). **Response 404:** `{"error": "Post not found"}` — for unknown slug **or** a slug that exists but is `draft`/`archived` (both return the identical 404, matching the frontend's "Article Not Found" state; admins must use the Admin endpoint to see drafts).

#### `GET /api/blog/posts/<slug>/related?limit=3` 🟢
- **Purpose:** Related posts — same-category-first, backfilled from other categories.
- **Query params:** `limit` (int, default 3).
- **Response 200:** array of post objects. **Response 404:** if `slug` doesn't resolve to a published post.

#### `GET /api/blog/categories` 🟢 · `GET /api/blog/tags` 🟢
- **Response 200:** flat array of strings, e.g. `["Tax Planning", "GST", ...]` — **note:** this returns category/tag **names only**, not `{id, name, slug}` objects; the Admin Panel's category/tag pickers will need the forthcoming admin endpoints (§4.4) for id-bearing records.

### 2.3 Firm Content — `firm_bp`, prefix `/api`
| Endpoint | Method | Response shape |
|---|---|---|
| `/api/awards` | GET | `[{id, title, description, year}]` — active only, sorted |
| `/api/certifications` | GET | `[{id, name, description, issuingBody}]` — active only, sorted |
| `/api/firm-stats` | GET | `[{id, key, label, value, suffix, icon}]` — active only, sorted |

All three: no auth, no params, no pagination (small fixed lists by design).

### 2.4 Services — `services_bp`, prefix `/api/services`
| Endpoint | Method | Notes |
|---|---|---|
| `/api/services` | GET | `[{id, name, slug, shortDescription, fullDescription, icon}]` — active only |
| `/api/services/<slug>` | GET | Same shape **plus** `faqs: [{question, answer}]`. **404** `{"error": "Service not found"}` if slug unknown or inactive. |

### 2.5 Team — `team_bp`, prefix `/api/team`
- `GET /api/team` → `[{id, name, slug, designation, bio, qualifications: [string], photoUrl, email, linkedinUrl}]` — active only, sorted. `qualifications` is server-split from the stored comma-separated string.

### 2.6 Testimonials — `testimonials_bp`, prefix `/api/testimonials`
- `GET /api/testimonials` → `[{id, clientName, clientDesignation, clientCompany, content, rating, photoUrl, isFeatured}]` — active only, sorted.

### 2.7 Newsletter — `newsletter_bp`, prefix `/api/newsletter`
#### `POST /api/newsletter/subscribe` 🟢
- **Auth:** None. **Rate limit:** 5/minute (Flask-Limiter, confirmed in code).
- **Request:** `{"email": "user@example.com"}`
- **Validation:** non-empty and contains `@` (a deliberately simple check — full RFC validation is not applied here, unlike Contact/Career which use `email-validator`; **flagged as an inconsistency worth resolving**, see §5.2).
- **Response 201:** `{"message": "Subscribed successfully."}` — same response whether the email is new or re-subscribing (idempotent, matches audit intent).
- **Response 400:** `{"error": "A valid email address is required."}`

### 2.8 Careers — `career_bp` (standalone Blueprint), prefix `/api/careers`
#### `GET /api/careers/openings` 🟢
- **Response 200:** `[{id, title, slug, department, location, employmentType, description, requirements, responsibilities, minExperienceYears}]` — active only, sorted by `posted_at` desc.

#### `POST /api/careers/applications` 🟢 · multipart/form-data
- **Auth:** None. **Rate limit:** 5/minute.
- **Form fields:** `name`, `email`, `phone`, `position`, `experience` (optional), `message` (optional — cover letter; no corresponding input in the live `ApplyNow.jsx` form today, so arrives empty), `resume` (file).
- **Validation (server-side, exact rules):**
  - `name`: required, ≥3 chars
  - `email`: required, RFC-validated via `email-validator`
  - `phone`: required, regex `^[6-9]\d{9}$` (Indian mobile)
  - `resume`: required; extension must be `.pdf`/`.doc`/`.docx`; **then** content-sniffed via `python-magic` against an allowed MIME whitelist — a file renamed to `.pdf` that isn't actually a PDF is rejected at this second stage.
- **Response 201:** `{"message": "Application submitted successfully."}`
- **Response 400:** `{"error": "Validation failed", "fields": {"resume": "Resume must be a PDF or Word document (.pdf, .doc, .docx)."}}` (field errors) **or** `{"error": "Resume file content did not match an allowed document type."}` (MIME-sniff failure, not a field error).
- **Response 413:** upload exceeds `UPLOAD_MAX_MB` (global handler).
- **Side effects:** stores the file via `storage_service.py` (randomized filename, local disk today), sends an HR notification email via `email_service.py` (Resend, SMTP fallback in dev), using `templates/emails/career_notification.html`.

### 2.9 Contact — `contact_bp` (standalone Blueprint), prefix `/api/enquiries`
#### `POST /api/enquiries` 🟢
- **Auth:** None. **Rate limit:** 5/minute.
- **Request:** `{"name": "...", "email": "...", "phone": "...", "service": "...", "message": "..."}`
- **Validation (exact):** `name` ≥3 chars; `email` RFC-validated; `phone` regex `^[6-9]\d{9}$`; `message` required, ≥20 chars; `service` optional, ≤200 chars (free text — holds either a picked service label or the frontend's "Other" custom text, there is no server-side enum constraint on this field).
- **Response 201:** `{"message": "Enquiry submitted successfully."}`
- **Response 400:** `{"error": "Validation failed", "fields": {...}}`
- **Side effects:** persists to `enquiries` (capturing `ip_address`, `user_agent`), sends notification email via `templates/emails/contact_notification.html`.

**Total live, working, public endpoints: 17** (health, 5 blog, 3 firm, 2 services, 1 team, 1 testimonials, 1 newsletter, 2 careers, 1 enquiries).

---

## 3. Authentication API — 🔵 PLANNED

Required to unlock every endpoint in §4. Built on Flask-JWT-Extended (already a dependency) + the new `refresh_tokens` table (Document 4 §2.2).

### `POST /api/auth/login` 🔵
| | |
|---|---|
| **Auth** | None |
| **Rate limit** | 5 attempts / 15 min / (IP + email) pair |
| **Request** | `{"email": "admin@saa.com", "password": "..."}` |
| **Response 200** | `{"accessToken": "<jwt>", "admin": {"id": 1, "name": "...", "email": "...", "role": "admin"}}` — refresh token set as an `httpOnly`/`Secure`/`SameSite=Strict` cookie, **not** in the JSON body |
| **Errors** | 400 validation, 401 invalid credentials, 403 account `is_active=false`, 429 rate-limited |

### `POST /api/auth/refresh` 🔵
| | |
|---|---|
| **Auth** | Valid refresh-token cookie |
| **Response 200** | `{"accessToken": "<new jwt>"}` — rotates the refresh token (old one marked `revoked_at`, new row's `replaced_by_id` links back) |
| **Errors** | 401 missing/expired/revoked token |

### `GET /api/auth/me` 🔵
| | |
|---|---|
| **Auth** | Bearer JWT |
| **Response 200** | `{"id": 1, "name": "...", "email": "...", "role": "admin", "lastLoginAt": "..."}` |
| **Errors** | 401 |

### `POST /api/auth/logout` 🔵
| | |
|---|---|
| **Auth** | Bearer JWT |
| **Effect** | Marks the current `refresh_tokens` row `revoked_at = now()`, clears the cookie |
| **Response 200** | `{"message": "Logged out."}` |

---

## 4. Admin API — 🔵 PLANNED

All routes below are prefixed `/api/admin` (the already-registered, currently-empty `admin_bp`). **Every route requires `Authorization: Bearer <JWT>`**; role requirement noted per-route (`admin` / `editor` / either).

### 4.1 Standard CRUD Contract

Twelve of the modules below (team, testimonials, awards, certifications, firm-stats, services + service-faqs, job-openings, blog-categories, blog-tags, blog-authors, media, site-settings) follow one identical contract, documented once:

```
GET    /api/admin/{resource}          # paginated list — editor or admin
GET    /api/admin/{resource}/{id}     # single record — editor or admin
POST   /api/admin/{resource}          # create — editor or admin — 201 + record
PUT    /api/admin/{resource}/{id}     # full update — editor or admin — 200 + record
DELETE /api/admin/{resource}/{id}     # editor or admin — 204, or 409 if referenced elsewhere
```
- **List response shape:** `{"items": [...], "total": 143, "page": 1, "pageSize": 20}`.
- **List query params:** `?page=`, `?pageSize=` (default 20, max 100), `?sort=field:asc|desc`, `?q=` (free-text search where applicable), plus resource-specific filters noted per module.
- **Errors (all methods):** 401 missing/expired token, 403 insufficient role, 404 unknown id, 422 validation failure *(admin CRUD uses 422 per this specification, distinct from the public API's existing 400 — see §5.3 for why these are intentionally NOT unified)*.
- **Audit logging:** every POST/PUT/DELETE writes one `audit_logs` row (`action` = `create`/`update`/`delete`, `entity_type` = resource name, `entity_id`, `details` = changed-field diff).

### 4.2 Resource-by-Resource Notes (extending the standard contract)

| Resource | Base path | Role | Notes |
|---|---|---|---|
| Team members | `/api/admin/team-members` | editor+ | DELETE is soft (`is_active=false`), never a real DROP row |
| Testimonials | `/api/admin/testimonials` | editor+ | `PATCH /api/admin/testimonials/{id}/feature` toggles `is_featured` |
| Awards | `/api/admin/awards` | editor+ | — |
| Certifications | `/api/admin/certifications` | editor+ | — |
| Firm stats | `/api/admin/firm-stats` | editor+ | `key` uniqueness enforced (422 on duplicate) — this is the control point that fixes the "three different years-of-experience numbers" defect |
| Services | `/api/admin/services` | editor+ | Nested `PUT /api/admin/services/{id}/faqs` replaces the full FAQ set (list payload) — mirrors the parent/child ownership of `service_faqs` |
| Job openings | `/api/admin/job-openings` | editor+ | DELETE blocked (409) if `job_applications` reference it — soft-delete via `is_active=false` instead, consistent with Document 4 §2.5 |
| Blog categories/tags/authors | `/api/admin/blog-categories`, `/blog-tags`, `/blog-authors` | editor+ | DELETE blocked (409) if referenced by any `blog_posts`/`blog_post_tags` row |
| Media | `/api/admin/media` | editor+ | See §4.3 (upload is a distinct endpoint shape, not a plain POST) |
| Site settings | `/api/admin/site-settings` | **admin only** | No DELETE (settings are upserted, not removed); `GET` returns all keys as one object `{ "phone": "...", "whatsapp": "...", ... }` rather than a paginated list |

### 4.3 Media Library

#### `POST /api/admin/media` 🔵 · multipart/form-data
- **Auth:** editor+. **Request:** `file` (binary), `altText` (optional string).
- **Validation:** MIME-sniffed against an image whitelist (png/jpg/webp/svg — reusing the `python-magic` pattern already proven for résumés), size-capped via `UPLOAD_MAX_MB`.
- **Response 201:** `{id, filename, originalFilename, path, mimeType, sizeBytes, altText, uploadedBy, createdAt}`.
- **Errors:** 422 (bad MIME/missing file), 413 (too large).

#### `GET /api/admin/media?page=&q=` 🔵
- **Response 200:** paginated list, same envelope as §4.1, each item as above.

#### `PATCH /api/admin/media/{id}` 🔵
- **Request:** `{"altText": "..."}`. **Response 200:** updated record.

#### `DELETE /api/admin/media/{id}` 🔵
- **Response 204**, or **409** `{"error": "Media is still referenced by 3 record(s).", "references": [...]}` if any `*_media_id` FK points to it (all currently `ON DELETE SET NULL` at the DB level, but the API layer blocks the delete proactively so an admin doesn't silently blank out a live team photo).

### 4.4 Blog Admin (full detail — the most complex content module)

#### `GET /api/admin/blog/posts?status=&category=&page=` 🔵
- **Auth:** editor+. Unlike the public `GET /api/blog/posts`, this returns **all** statuses (draft/published/archived) and supports the `status`/`category` filters the public endpoint currently lacks.
- **Response 200:** paginated envelope; each item includes `status`, `viewsCount`, `metaTitle`, `metaDescription` (not exposed publicly).

#### `GET /api/admin/blog/posts/{id}` 🔵
- **Response 200:** full record including all child `keyTakeaways`, `faqs`, `tags` (as `{id, name}` objects, not just names).

#### `POST /api/admin/blog/posts` 🔵
- **Request body:**
```json
{
  "title": "...", "slug": "...", "excerpt": "...", "content": "<p>...</p>",
  "featuredImageMediaId": 12, "categoryId": 3, "authorId": 1,
  "status": "draft", "metaTitle": "...", "metaDescription": "...",
  "tagIds": [4, 7], "keyTakeaways": ["...", "..."],
  "faqs": [{"question": "...", "answer": "..."}]
}
```
- **Validation:** `title`, `slug` (unique, URL-safe), `content` required; `status` ∈ `draft|published|archived`; if `status=published`, `publishedAt` is set server-side to `now()` if not already set (mirrors the `blog_posts.published_at` nullable design in Document 4).
- **Response 201:** full created record (including generated `id`).
- **Response 422:** `{"error": "Validation failed", "fields": {"slug": "This slug is already in use."}}`.

#### `PUT /api/admin/blog/posts/{id}` 🔵
- Full replace, same body shape. **SEO-impact rule:** if `slug` changes on an already-published post, the response includes `"warnings": ["Changing the slug of a published post breaks existing inbound links and search rankings."]` alongside the 200 — a warning, not a block, per Document 1 Business Rule #2.

#### `DELETE /api/admin/blog/posts/{id}` 🔵
- **Behavior:** soft — sets `status='draft'` (unpublishes) is a **separate, safer** action from actual deletion; true DELETE additionally requires the post already be in `draft`/`archived` status (422 if attempting to hard-delete a `published` post — must unpublish first, a two-step guard against accidental data loss).

#### `PATCH /api/admin/blog/posts/{id}/status` 🔵
- **Request:** `{"status": "published"}`. Dedicated endpoint for the common "just publish/unpublish" action without resending the full post body.

### 4.5 Enquiries (Admin)

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/enquiries?status=&page=` | GET | editor+ | Filter by `new`/`in_progress`/`resolved`, default sort newest-first |
| `/api/admin/enquiries/{id}` | GET | editor+ | Single record detail |
| `/api/admin/enquiries/{id}` | PATCH | editor+ | `{"status": "in_progress"}` — status only, no other field is editable (an enquiry's submitted content is immutable) |
| `/api/admin/enquiries/export` | GET | editor+ | `?format=csv`, streams a CSV of the filtered result set |

No CREATE (enquiries only originate from the public form) and no DELETE (retained for firm records; only status changes).

### 4.6 Job Applications (Admin)

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/careers/applications?status=&jobOpeningId=&page=` | GET | editor+ | |
| `/api/admin/careers/applications/{id}` | GET | editor+ | Includes `resumeDownloadUrl` — a **signed, short-lived** URL (15 min TTL), never the raw `resume_path` |
| `/api/admin/careers/applications/{id}` | PATCH | editor+ | `{"status": "shortlisted", "notes": "..."}` |
| `/api/admin/careers/applications/{id}` | DELETE | **admin only** | GDPR-style permanent removal (record + stored résumé file) — restricted to `admin` role given its irreversibility, per SRS BR/Document 1 Assumption A-05 |

### 4.7 Newsletter (Admin)

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/newsletter/subscribers?status=&page=` | GET | editor+ | |
| `/api/admin/newsletter/subscribers/export` | GET | editor+ | CSV export |
| `/api/admin/newsletter/subscribers/{id}` | DELETE | editor+ | Sets `status=unsubscribed` (soft; matches the public unsubscribe semantics) |

### 4.8 Audit Log (Admin, read-only)

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/audit-logs?adminId=&entityType=&from=&to=&page=` | GET | **admin only** | Read-only, per SRS FR-13 |

### 4.9 Admin User Management

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/users` | GET | **admin only** | List all admin accounts |
| `/api/admin/users` | POST | **admin only** | Create (`{name, email, role}`) — invite-based: generates a one-time setup token emailed to the new user rather than accepting a plaintext password over the API |
| `/api/admin/users/{id}` | PATCH | **admin only** | Update name/role/`isActive` |
| `/api/admin/users/{id}` | DELETE | **admin only** | Blocked (422) if `id` matches the requesting admin's own id — enforces Document 1 Business Rule #6 |
| `/api/admin/users/{id}/reset-password` | POST | **admin only** | Triggers a password-reset email; the Admin Panel never accepts a password directly from another admin |

### 4.10 Dashboard / Analytics (Admin)

| Endpoint | Method | Role | Notes |
|---|---|---|---|
| `/api/admin/dashboard/summary` | GET | editor+ | `{newEnquiries, newApplications, publishedPosts, activeJobOpenings, newsletterSubscribers}` — counts for the Dashboard module (Document 2) |
| `/api/admin/dashboard/activity` | GET | editor+ | Recent `audit_logs` entries, capped (e.g. last 20), for the Dashboard's activity feed |

---

## 5. Gap Notes & Inconsistencies to Resolve

*(Findings from direct comparison of the live implementation against the original audit plan — flagged per the "never make assumptions, identify what's missing" instruction.)*

1. **§2.2** `GET /api/blog/posts` has no pagination/filtering today despite the audit's plan (`?category=&q=&page=`) and despite `frontend`'s blog listing UI already doing this filtering client-side against the full 28-post payload. **This must be added** before blog volume grows past what's reasonable to ship whole to the client — tracked as Document 11 Phase 2 work, not blocking Admin Panel launch, but a pre-existing debt this documentation surfaces rather than hides.
2. **§2.7** Newsletter email validation (`"@" in email`) is materially weaker than Contact/Career's `email-validator`-based validation. **Recommend unifying** on `email-validator` for consistency — a small, low-risk fix.
3. **§4.1 vs. live public API** — the public endpoints return **400** for validation failures; this specification defines Admin CRUD endpoints as returning **422**. This is an intentional distinction (400 = malformed/unparseable request, 422 = well-formed but semantically invalid — e.g. a duplicate slug), consistent with common REST practice, but it means the Admin Panel's frontend error-handling code **cannot** reuse the public API's existing 400-shaped error handling verbatim and must branch on status code. Flag this explicitly in the Admin Panel's `api/client.js` extension (Document 3, API Layer).
4. **`GET /api/blog/categories` / `/tags`** return bare name arrays, not `{id, name, slug}` — fine for the public site's current dropdown-filter use, but the Admin Panel's blog editor (§4.4) needs id-bearing category/tag pickers, which only the new `/api/admin/blog-categories` / `/blog-tags` endpoints provide. Do not attempt to reuse the public endpoints for the Admin Panel's post editor.
5. **reCAPTCHA** (`RECAPTCHA_SECRET` env var) is reserved but unused on any public write endpoint (`/enquiries`, `/careers/applications`, `/newsletter/subscribe`). Not part of this API's committed contract; tracked as a hardening item in Document 11.

---

## 6. OpenAPI-Ready Schema Skeleton

The following is a minimal, valid OpenAPI 3.0 skeleton covering the live public surface plus the planned auth/admin groups, intended as the literal starting point for a full `openapi.yaml` (component schemas for every resource should be expanded 1:1 from Document 4's table definitions when the OpenAPI file is authored as an implementation artifact — out of scope for this documentation-only deliverable).

```yaml
openapi: 3.0.3
info:
  title: SAA Website & Admin Panel API
  version: "1.0"
  description: Public marketing-site API (live) plus Admin Panel API (planned).
servers:
  - url: /api
tags:
  - name: Public
  - name: Auth
  - name: Admin
paths:
  /health:
    get:
      tags: [Public]
      responses: { "200": { description: OK } }
  /blog/posts:
    get:
      tags: [Public]
      responses: { "200": { description: List of published posts } }
  /enquiries:
    post:
      tags: [Public]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, email, phone, message]
              properties:
                name: { type: string, minLength: 3 }
                email: { type: string, format: email }
                phone: { type: string, pattern: "^[6-9]\\d{9}$" }
                service: { type: string }
                message: { type: string, minLength: 20 }
      responses:
        "201": { description: Enquiry created }
        "400": { description: Validation failed }
        "429": { description: Rate limited }
  /auth/login:
    post:
      tags: [Auth]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [email, password]
              properties:
                email: { type: string, format: email }
                password: { type: string }
      responses:
        "200": { description: Login success, returns access token }
        "401": { description: Invalid credentials }
  /admin/blog/posts:
    get:
      tags: [Admin]
      security: [{ bearerAuth: [] }]
      responses: { "200": { description: Paginated post list } }
    post:
      tags: [Admin]
      security: [{ bearerAuth: [] }]
      responses:
        "201": { description: Post created }
        "422": { description: Validation failed }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```
