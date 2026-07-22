# Software Requirement Specification (SRS)
## Singh Amit & Associates — Admin Panel & Backend Platform

| | |
|---|---|
| **Document Version** | 1.0 |
| **Status** | Draft for Development |
| **Prepared For** | Singh Amit & Associates ("SAA", "CA India") |
| **System** | SAA Public Website + Admin Panel (React + Flask + MySQL) |
| **Source of Truth** | `frontend/SAA-Architecture-Analysis.pdf` (Software Architecture & Backend Readiness Report) + live codebase inspection of `backend/` and `frontend/src/api/` on the date of writing |
| **Author** | Principal Software Architect (documentation engagement) |

### Revision History
| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | Current | Architecture Documentation Team | Initial SRS derived from audit report and backend inspection |

---

## 1. Executive Summary

Singh Amit & Associates operates a production marketing website (React 19 + Vite + Tailwind CSS 4) for a Chartered Accountancy practice based in Roorkee, Uttarakhand. The site's purpose is lead generation, credibility building, SEO-driven content marketing, and recruitment. It is live and public-facing today.

A Flask + MySQL backend has already been partially built. As confirmed by direct inspection of the repository, **21 of a planned ~22 database tables exist and are migrated**, and **~17 public-facing REST endpoints are implemented and consumed by the frontend** (blog, services, team, testimonials, firm stats/awards/certifications, newsletter subscription, contact enquiry submission, and career application submission with résumé upload). Centralized error handling, request logging, rate limiting, transactional email (Resend, with SMTP dev fallback), and MIME-verified file upload are all working.

**What does not exist today is any administrative capability.** There is no authentication system (`/api/auth/*` is a stub with zero endpoints), no admin CRUD surface (`/api/admin/*` is a stub with zero endpoints), and no admin UI in the frontend. Every content record currently visible on the site (blog posts, team bios, testimonials, awards, job openings, site settings) can only be changed by a developer editing a seed script and redeploying. Every inbound enquiry, job application, and newsletter signup is captured in MySQL but can only be read by directly querying the database — there is no interface for staff to review, action, or export this data.

This SRS defines the requirements for the **Admin Panel**: the authenticated, role-based management system that will let non-technical SAA staff manage all site content and business data without developer involvement, while preserving the existing public site and its already-working backend exactly as built.

---

## 2. Business Goals

1. **Eliminate developer dependency for routine content changes.** Blog posts, team bios, testimonials, job openings, awards, and firm statistics currently require a code change and redeploy. The Admin Panel must let an authorized staff member publish these changes in minutes.
2. **Never lose a lead again.** Enquiries, job applications, and newsletter signups are already captured in the database but are invisible to staff. The Admin Panel must expose them with status tracking so no enquiry goes unanswered.
3. **Establish accountability and traceability.** Every change made through the Admin Panel must be attributable to a specific admin user and time-stamped (the `audit_logs` table already exists for this purpose but is not yet written to).
4. **Protect the public site's reliability.** The Admin Panel is an additive system. It must not require any breaking change to the 17 already-working public endpoints or the live frontend's `frontend/src/api/*` integration layer.
5. **Fix the firm-stats inconsistency identified in the audit** (three different "years of experience" figures — 12+, 20+, 25+ — appear across the live site) by making the `firm_stats` table, once admin-editable, the single source of truth.
6. **Support future growth** (more blog volume, more service lines, more staff) without a schema or architecture rewrite.

---

## 3. Project Scope

### In Scope
- An **Admin Panel** (new authenticated route tree, either within the existing React app under `/admin/*` or as a separate app) covering every module listed in Document 2 (Complete Admin Panel Planning).
- **Authentication & Authorization backend**: `/api/auth/*` (login, refresh, me, logout) and role-based guards on all admin routes, built on the already-installed but unused Flask-JWT-Extended dependency.
- **Admin CRUD backend**: `/api/admin/*` endpoints for all 21 existing tables (blog, team, testimonials, services, careers, awards, certifications, firm stats, site settings, media, enquiries status management, job application status management) plus a new `refresh_tokens` (or equivalent session-revocation) table.
- **Media Library**: centralized upload/browse/manage for images used across blog, team, testimonials, awards, and services — writing to the existing but currently-unused `media` table.
- **Audit Logging surfaced in UI**: reading and displaying the existing `audit_logs` table, and writing to it from every admin mutation.
- Fixing the identified content-consistency defect (firm stats) as a direct consequence of the Firm Stats module going live.
- Documentation-only deliverables (this SRS and the 11 companion documents) — **no implementation code is produced as part of this documentation engagement.**

### Out of Scope
- **Rebuilding or redesigning the public marketing site.** All 11 public routes, their component trees, and their visual design remain as-is. Only the two enhancement fixes explicitly identified as low-risk (per-route SEO metadata, dead-code removal) are candidates for a *separate* frontend maintenance pass, not this Admin Panel project.
- **Public visitor accounts, login, or client portal features.** Confirmed in the audit and by inspection: this is a marketing site, not a SaaS product. No requirement exists for end-client authentication, self-service document exchange, or a client dashboard.
- **Migrating off MySQL** or off the Flask/SQLAlchemy stack. This documentation set reuses the existing architecture per the engagement's explicit constraint to avoid unnecessary redesigns.
- **Payment processing / billing.** No payment, invoicing, or e-commerce functionality is implied anywhere in the audit or current codebase.
- **Mobile native apps.** The Admin Panel is a responsive web application only.
- **Multi-tenancy.** This system serves one firm (SAA) only; no requirement exists for supporting multiple CA firms on one deployment.
- **Real interactive tools** hinted at by the audit (e.g., a genuine GST filing-due-date calendar, an interactive compliance health-check quiz) — these are flagged in the audit as future candidates, not committed scope.
- **S3/cloud object storage migration** — the `storage_service.py` seam exists (`_save_to_s3` raises `NotImplementedError`) but implementing it is a deployment-phase decision (see Document 10), not an Admin Panel functional requirement.

---

## 4. Business Requirements

| ID | Requirement |
|---|---|
| BR-01 | Staff must be able to log in with a firm-issued account and see only the functions their role permits. |
| BR-02 | Every enquiry and job application submitted on the public site must be visible to staff within the Admin Panel, with a workflow status they can update. |
| BR-03 | Blog content must be publishable, editable, and unpublishable without a code deployment. |
| BR-04 | All "About the firm" content (team, awards, certifications, testimonials, firm statistics) must be centrally editable and consistent across every page that displays it. |
| BR-05 | Job openings must be manageable independently of the recruitment page's static design. |
| BR-06 | The firm must retain an auditable record of who changed what content and when. |
| BR-07 | The system must not expose any admin function to unauthenticated users or to the public internet without a valid session. |
| BR-08 | The Admin Panel must be usable by non-technical staff (partners, office managers, HR) without developer assistance for day-to-day operation. |

---

## 5. Functional Requirements

Full per-module functional detail (screens, fields, workflows) is specified in **Document 2 — Complete Admin Panel Planning**. At the SRS level:

### 5.1 Authentication & Session Management
- FR-01: The system shall authenticate admins via email + password against the `admins` table (`password_hash`, argon2).
- FR-02: The system shall issue a short-lived JWT access token (≤15 min) and a long-lived, httpOnly, rotated refresh token, per the architecture already specified in the audit (Part 8) and already scaffolded via Flask-JWT-Extended in `requirements.txt`.
- FR-03: The system shall support two roles at launch: `admin` (full access, including user management and site settings) and `editor` (content management only, no access to admin-user management or site settings).
- FR-04: The system shall lock out or exponentially back off repeated failed logins (5 attempts / 15 min / IP+email pair).
- FR-05: The system shall allow an authenticated admin to view their own profile and log out (revoking the refresh token server-side).

### 5.2 Content Management
- FR-06: The system shall provide full CRUD for: blog posts (with categories, tags, key takeaways, FAQs), team members, testimonials, services (with service FAQs), awards, certifications, firm stats, job openings, and site settings.
- FR-07: The system shall provide a Media Library for uploading, browsing, tagging (alt text), and deleting images, backed by the existing `media` table, with re-use across all content modules.
- FR-08: The system shall support draft/published (and, for blog, archived) states for publishable content, matching the existing `blog_posts.status` enum.

### 5.3 Lead & Applicant Management
- FR-09: The system shall list, filter, and update the status of records already flowing into `enquiries` via the live `POST /api/enquiries` endpoint.
- FR-10: The system shall list, filter, and update the status of records already flowing into `job_applications` via the live `POST /api/careers/applications` endpoint, including secure (signed/short-lived URL) résumé download.
- FR-11: The system shall list and allow export/unsubscribe management of records in `newsletter_subscribers`.

### 5.4 Governance
- FR-12: The system shall write an `audit_logs` entry (admin, action, entity type/id, timestamp, IP) for every create, update, delete, publish, and status-change action performed in the Admin Panel.
- FR-13: The system shall expose a read-only Audit Log screen to `admin`-role users.

### 5.5 Non-functional-adjacent functional requirements
- FR-14: The Admin Panel shall not alter the request/response contract of any of the 17 existing public endpoints.
- FR-15: The Admin Panel shall be reachable only over the same domain/CORS-restricted origin already configured (`CORS_ORIGINS` env var).

---

## 6. Non-Functional Requirements

### 6.1 Performance Requirements
| Metric | Target |
|---|---|
| Admin API response time (list endpoints, p95) | < 400ms under nominal load (≤ 20 concurrent admin sessions — this is an internal tool for a single firm's staff, not a high-traffic consumer product) |
| Admin Panel initial load (code-split from public site) | < 2.5s on a broadband connection |
| Public site endpoints (already live) | No regression versus current measured behavior; existing 17 endpoints must not slow down due to admin traffic sharing the same MySQL instance |
| File upload (résumé, media) | Must complete or fail within 15s for files up to the configured `UPLOAD_MAX_MB` |

### 6.2 Security Requirements
- All admin endpoints require a valid JWT with an appropriate role claim; enforced server-side on every route, never client-side only (the audit explicitly flags that 100% of validation today is client-side and trivially bypassed).
- Passwords hashed with argon2id (already a dependency: `argon2-cffi`), never stored or logged in plaintext.
- Refresh tokens stored `httpOnly` + `Secure` + `SameSite=Strict`.
- All admin mutation endpoints re-validate every field server-side, independent of frontend form validation (see Document 8 — Validation Specification).
- File uploads (résumés, media images) must be verified by content-sniffed MIME type (already implemented via `python-magic` for résumés — the same pattern must extend to media uploads), size-capped server-side, and stored with randomized filenames outside any publicly-executable path.
- Rate limiting applies to `/api/auth/login` (5/15min/IP+email) in addition to the existing rate limits on public write endpoints.
- CSRF defense-in-depth via `Origin`/`Referer` header checks on state-changing admin routes, since the refresh-token cookie is the one CSRF-relevant credential in play.
- No secret values (JWT secret, DB credentials, email provider keys, reCAPTCHA secret) are ever committed to source control — `.env` is gitignored today and must remain so; `.env.example` is the only committed template.
- reCAPTCHA verification (config value already reserved as `RECAPTCHA_SECRET`) should be implemented on public write endpoints as a security hardening item, tracked in Document 11 (Roadmap), not blocking Admin Panel launch.

### 6.3 Accessibility Requirements
- The Admin Panel must meet **WCAG 2.1 Level AA** at minimum, consistent with the public site's already-good accessibility hygiene (documented in the audit: correct `aria-label`, `aria-expanded`/`aria-controls`, `aria-current`, focus-visible outlines, `useReducedMotion` support).
- All data tables must be keyboard-navigable; all icon-only admin actions (edit, delete, publish) must carry `aria-label`.
- Form validation errors must be programmatically associated with their fields (`aria-describedby`) and announced to screen readers.
- Color must never be the sole indicator of status (e.g., enquiry status badges need text/icon, not color alone).

### 6.4 Scalability Requirements
- The audit rates current scalability at 5/10 specifically because 28 blog posts are shipped whole to every browser. The Admin Panel's blog endpoints must use the already-implemented server-side pagination (`GET /api/blog/posts?page=`) rather than reintroducing a client-side-only pattern.
- Schema must support growth to several thousand blog posts, several hundred job applications/enquiries per month, and a media library in the low thousands of files without redesign — the existing indexed, normalized 21-table schema already satisfies this (see Document 4).
- The architecture must support horizontal scaling of the Flask app behind a load balancer (stateless JWT auth already supports this; session state must never be kept in-process).

### 6.5 Browser Support
| Browser | Minimum Version |
|---|---|
| Chrome / Edge (Chromium) | Last 2 major versions |
| Firefox | Last 2 major versions |
| Safari (macOS & iOS) | Last 2 major versions |
| Mobile Chrome (Android) | Last 2 major versions |

The Admin Panel is desktop-first (data tables, forms) but must remain usable on tablet viewports (≥768px). Public-site browser support is unchanged from current production behavior.

---

## 7. User Personas

| Persona | Description | Primary Needs |
|---|---|---|
| **CA Amit Singh — Managing Partner (`admin` role)** | Firm owner, final authority on published content, manages staff accounts. | Full visibility into leads, ability to add/remove admin users, oversight via audit log, control of site settings. |
| **Marketing/Content Coordinator (`editor` role)** | Non-technical staff responsible for blog publishing, testimonials, and team-page upkeep. | Simple, guided content forms (rich text, media picker), no access to sensitive settings or user management. |
| **HR/Office Manager (`editor` role)** | Manages job openings and reviews applications. | Fast application triage (status, résumé download), job posting CRUD. |
| **Prospective Client (public visitor, no login)** | Uses the public site to research the firm and submit an enquiry. | Fast, trustworthy site; confidence their enquiry was received (already partially served by the working `POST /api/enquiries` endpoint). |
| **Job Applicant (public visitor, no login)** | Applies via the Career page. | Reliable résumé upload and application confirmation (already working end-to-end, confirmed by a live test file found in `backend/uploads/resumes/`). |

---

## 8. User Roles

| Role | Defined In | Scope |
|---|---|---|
| `admin` | `admins.role` enum (already in schema) | Full CRUD on all modules, admin user management, site settings, audit log access. |
| `editor` | `admins.role` enum (already in schema) | CRUD on content modules (blog, team, testimonials, services, awards, certifications, careers, media) and read/status-update on enquiries/applications. No access to admin user management or site settings. |
| Public (unauthenticated) | N/A | Read access to published content via the 17 existing public endpoints; write access limited to enquiry submission, career application, newsletter subscription — exactly as already implemented. |

Full CRUD-by-module breakdown is in **Document 7 — Permission Matrix**.

## 9. Role Responsibilities

| Role | Responsibilities |
|---|---|
| `admin` | Publishing final say; managing `editor`/`admin` accounts; configuring site settings (firm contact details, social links, SEO defaults); reviewing the audit log; all `editor` responsibilities. |
| `editor` | Drafting and publishing blog posts; maintaining team/testimonials/awards/certifications; managing job openings; triaging enquiries and applications (status updates, notes); uploading and organizing media. |

---

## 10. Business Rules

1. A blog post cannot be `published` without a title, slug (unique), category, author, and non-empty content — mirrors the existing `blog_posts` NOT NULL/UNIQUE constraints.
2. A blog post's slug, once published and indexed by search engines, should not be changed without an explicit admin confirmation (SEO-impact warning) — a UX rule enforced in the Admin Panel, not the database.
3. Deleting a `blog_category` or `blog_tag` that is still referenced by any post is blocked (409 Conflict) — consistent with the audit's documented standard CRUD contract (Document 5).
4. `firm_stats.stat_key` is unique — there can be only one canonical value for "years of experience," eliminating the three-different-numbers defect identified in the audit.
5. A `job_opening` cannot be deleted if it has associated `job_applications`; it must instead be soft-deleted (`is_active = false`) — preserving referential history for HR reporting.
6. An `admin` cannot delete their own account (prevents accidental lockout of the last administrator).
7. Every status transition on `enquiries` and `job_applications` must be logged to `audit_logs` with the acting admin's ID.
8. Résumé files are retained per the firm's data-retention policy (see Assumption A-05) and are never served from a public, guessable URL — only via a signed/short-lived link to an authenticated admin session, per the audit's Part 7 API design.

---

## 11. System Constraints

- **Technology stack is fixed**: React (frontend), Flask (backend), MySQL (database) — this documentation set explicitly reuses this stack per the engagement's constraint to avoid unnecessary redesigns.
- **Existing public API contract must not break.** All new work is additive (`/api/auth/*`, `/api/admin/*` are currently-empty stubs — the natural, lowest-risk integration point).
- **Existing 21-table schema is the baseline.** New tables (e.g., a refresh-token/session table) must integrate via foreign keys and naming conventions consistent with the existing schema (see Document 4).
- **Local file storage is the current default** (`STORAGE_BACKEND` env var, with an unimplemented S3 seam) — the Admin Panel's media features must work against local storage at launch and be storage-backend-agnostic in its API contract so S3 can be enabled later without a frontend change.
- **Single-firm, single-tenant deployment.** No requirement to support multiple organizations.
- **Windows-aware dev environment**: `gunicorn` (the specified production WSGI server) is POSIX-only per `requirements.txt`; local Windows development uses Flask's built-in server, and deployment targets a Linux host (see Document 10).

---

## 12. Dependencies

| Dependency | Status | Notes |
|---|---|---|
| Flask-JWT-Extended 4.7.1 | Installed, unused | Required for FR-01–FR-05; already in `requirements.txt`. |
| argon2-cffi | Installed, used only by seed script | Required for password hashing on the new login endpoint. |
| Flask-Limiter 3.12 + configured `RATELIMIT_STORAGE_URI` | Installed, in active use | Extend existing rate-limit patterns to `/api/auth/login` and all `/api/admin/*` write routes. |
| python-magic / python-magic-bin | Installed, in active use for résumés | Extend to media-library uploads. |
| Resend (primary) / SMTP (dev fallback) | Installed, in active use | Reused for any admin-triggered notification emails (e.g., "application status changed" — optional future enhancement, not committed scope). |
| MySQL 8.x via PyMySQL | Installed, in active use | No version change required. |
| `frontend/src/api/client.js` (`apiFetch` wrapper) | Implemented | New admin API modules (`api/admin/*.js`) should follow this existing pattern for consistency. |

---

## 13. Assumptions

- **A-01**: SAA has (or will designate) at least one `admin`-role staff member to seed the first account; the existing `seed_data.py` pattern is the basis for this bootstrap step.
- **A-02**: The firm does not require SSO / third-party identity provider integration (Google Workspace, Microsoft 365) at launch — email/password is sufficient. *(Flagged: not confirmed by any source document — if incorrect, this is a scope change.)*
- **A-03**: Admin Panel usage volume is low (single-digit concurrent staff users), consistent with an internal tool for one CA firm, not a public-facing product — this shapes the Performance Requirements in §6.1.
- **A-04**: The firm accepts English-only UI for both the public site and Admin Panel at launch — no i18n/l10n requirement exists in the audit or codebase.
- **A-05**: A formal résumé/enquiry data-retention period has not been specified anywhere in the source materials. **This is a gap**: the firm must define a retention policy (e.g., "delete unhired applicant résumés after 12 months") before the GDPR-style deletion feature (Document 2, Job Applications module) can be finalized with concrete defaults.
- **A-06**: `STORAGE_BACKEND` will remain local-disk through initial Admin Panel launch; S3 migration is a deployment-phase decision, not a blocking dependency.

---

## 14. Future Enhancements

*(Explicitly out of committed scope — carried forward from the audit's own findings for planning visibility only.)*

- Genuinely interactive GST filing-due-date calendar and compliance health-check tool (today: static informational layouts per the audit's Part 2 findings on `/services/gst-services`).
- Per-route SEO metadata (`<title>`/description/Open Graph/JSON-LD), `robots.txt`/`sitemap.xml` — flagged as the site's weakest area (audit Part 12) but a frontend maintenance task independent of the Admin Panel.
- Route-based code-splitting (`React.lazy`) and image optimization pipeline (`srcset`/WebP), also flagged in the audit's Performance Review, independent of Admin Panel scope.
- Analytics dashboard (traffic, lead-source attribution) beyond the basic reporting covered in Document 2's Analytics/Reports module.
- Two-factor authentication for admin accounts.
- Consolidating the four duplicated service-page component trees (GST, Income Tax, TDS, Accounting) into the shared `ServiceHero`/`ServiceSidebar`/`ServiceFAQAccordion`/`ServiceCTA` components the audit recommends (Part 3) — a frontend refactor, not a backend/admin requirement.

---

## 15. Success Criteria

| # | Criterion |
|---|---|
| 1 | An `admin` or `editor` can log in and reach a role-appropriate dashboard. |
| 2 | 100% of the 21 existing tables have a corresponding Admin Panel screen with working Create/Read/Update (Delete where applicable) per Document 7's Permission Matrix. |
| 3 | Every enquiry and job application submitted through the live public forms appears in the Admin Panel within the same request cycle (no polling delay beyond standard page refresh). |
| 4 | The firm-stats inconsistency (12+/20+/25+ years) is resolved to a single value editable in one place. |
| 5 | Zero regressions in the 17 existing public endpoints, verified by contract tests (see Document 9). |
| 6 | Every admin mutation produces a corresponding `audit_logs` row. |
| 7 | No admin route is reachable without a valid JWT bearing an authorized role, verified by security testing (see Document 9). |

---

## 16. Glossary

| Term | Definition |
|---|---|
| SAA | Singh Amit & Associates, the Chartered Accountancy firm and client. |
| Admin Panel | The authenticated management system this documentation set specifies. |
| Blueprint | Flask's module-routing pattern; each domain (`blog`, `admin`, `auth`, etc.) is registered as one. |
| JWT | JSON Web Token — the access/refresh token format used for stateless admin authentication. |
| Soft Delete | Marking a record inactive (`is_active=false`) rather than removing it from the database. |
| Enquiry | A contact-form submission captured in the `enquiries` table. |
| Slug | URL-safe unique identifier for blog posts/services/team members. |
| RBAC | Role-Based Access Control — the `admin`/`editor` permission model. |
| MIME sniffing | Verifying a file's true content type by inspecting its bytes, not trusting its filename extension. |
| ORM | Object-Relational Mapper — SQLAlchemy, used to define the 21 existing tables as Python models. |

---

## 17. References

1. `frontend/SAA-Architecture-Analysis.pdf` — Software Architecture & Backend Readiness Report (primary audit; source of truth for this document).
2. Live codebase inspection: `backend/app/models/`, `backend/app/blueprints/`, `backend/migrations/`, `backend/config/settings.py`, `frontend/src/api/`.
3. Document 2 — Complete Admin Panel Planning (companion document, per-module detail).
4. Document 4 — Database Design Document (companion document, full schema).
5. Document 5 — Complete API Specification (companion document, endpoint contracts).
6. Document 7 — Permission Matrix (companion document, role/module access detail).
