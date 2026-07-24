"""Seed the database with the site's real hardcoded content (not lorem ipsum).

Run with:  backend\\venv\\Scripts\\python.exe backend\\scripts\\seed_data.py

Idempotent: every entity is looked up by its natural key (slug/email/key) and
updated in place if it already exists, so running this repeatedly does not
create duplicates.
"""
import json
import re
import secrets
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

BACKEND_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BACKEND_ROOT))

from argon2 import PasswordHasher

from app import create_app
from app.extensions import db
from app.models import (
    Admin,
    Award,
    BlogAuthor,
    BlogCategory,
    BlogFaq,
    BlogKeyTakeaway,
    BlogPost,
    BlogTag,
    Certification,
    FirmStat,
    JobOpening,
    Media,
    Service,
    ServiceFaq,
    TeamMember,
    Testimonial,
)

ph = PasswordHasher()


def slugify(value):
    value = value.lower().strip()
    value = re.sub(r"[^\w\s-]", "", value)
    value = re.sub(r"[\s_-]+", "-", value)
    return value.strip("-")


def get_or_create(model, lookup, defaults=None):
    instance = model.query.filter_by(**lookup).first()
    if instance is None:
        instance = model(**lookup, **(defaults or {}))
        db.session.add(instance)
        db.session.flush()
        return instance, True
    for key, value in (defaults or {}).items():
        setattr(instance, key, value)
    db.session.flush()
    return instance, False


def guess_mime(path):
    ext = path.rsplit(".", 1)[-1].lower().split("?")[0]
    return {
        "png": "image/png",
        "jpg": "image/jpeg",
        "jpeg": "image/jpeg",
        "webp": "image/webp",
        "gif": "image/gif",
    }.get(ext, "application/octet-stream")


def get_or_create_media(path, alt_text):
    """Media rows for existing frontend/public assets referenced by the seed
    data. size_bytes is unknown for these (they were never uploaded through
    our pipeline) so it's stored as 0 - a real upload always overwrites this."""
    media = Media.query.filter_by(path=path).first()
    if media is None:
        media = Media(
            filename=path.rsplit("/", 1)[-1],
            original_filename=path.rsplit("/", 1)[-1],
            path=path,
            mime_type=guess_mime(path),
            size_bytes=0,
            alt_text=alt_text,
        )
        db.session.add(media)
        db.session.flush()
    return media


def run_frontend_extraction():
    script = BACKEND_ROOT / "scripts" / "extract_frontend_data.mjs"
    print("Extracting frontend data via Node...")
    try:
        subprocess.run(["node", str(script)], check=True, cwd=str(script.parent))
    except FileNotFoundError as exc:
        raise SystemExit(
            "Node.js is required to extract frontend/src/data (blog posts, partners). "
            "Install Node and ensure it's on PATH, then re-run."
        ) from exc
    snapshot_path = BACKEND_ROOT / "scripts" / "frontend_data.snapshot.json"
    return json.loads(snapshot_path.read_text(encoding="utf-8"))


# ---------------------------------------------------------------------------
# Content that has no dedicated frontend/src/data module - transcribed
# directly from the component files that currently hardcode it.
# ---------------------------------------------------------------------------

TESTIMONIALS = [
    {
        "client_name": "Rahul Sharma",
        "client_designation": "New Delhi - Business Owner",
        "content": "Their team handled our GST filings with outstanding professionalism. Every deadline was met, every document was accurate, and the entire process gave us complete confidence in their expertise.",
        "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    {
        "client_name": "Priya Verma",
        "client_designation": "Mumbai - Startup Founder",
        "content": "They guided us through company registration and compliance from start to finish. Their advice was practical, communication was excellent, and every step felt organized and completely stress-free throughout.",
        "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    },
    {
        "client_name": "Amit Mehta",
        "client_designation": "Ahmedabad - Business Owner",
        "content": "Our annual tax planning became significantly easier thanks to their knowledgeable team. They identified valuable savings, explained every detail clearly, and ensured every filing was completed without delays.",
        "photo": "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&w=200&q=80",
    },
    {
        "client_name": "Neha Kapoor",
        "client_designation": "Bengaluru - Freelancer",
        "content": "As a freelancer, I always worried about tax compliance and documentation. Their experts simplified everything, answered every question patiently, and delivered exactly what they promised without unnecessary complications.",
        "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
        "client_name": "Sandeep Arora",
        "client_designation": "Jaipur - Manufacturing Business",
        "content": "Their accounting and compliance services have transformed how we manage our finances. Professional guidance, prompt responses, and reliable support have made them a trusted partner for our growing business.",
        "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    },
]

AWARDS = [
    {"year": 2023, "title": "Best Emerging CA Firm", "description": "Recognized for innovative approach and excellence in service delivery (Indian Chartered Accountants Association)."},
    {"year": 2022, "title": "Excellence in Financial Advisory", "description": "For outstanding contributions to corporate taxation and planning (Business Excellence Awards India)."},
    {"year": 2021, "title": "Top 50 CA Firms", "description": "Ranked among India's leading chartered accountancy practices (CA Practice Magazine)."},
    {"year": 2020, "title": "Client Choice Award", "description": "Voted by clients for consistency and quality of service (Financial Services Excellence Forum)."},
    {"year": 2019, "title": "Innovation in Audit", "description": "For implementing cutting-edge audit methodologies (ICAI Annual Conference)."},
    {"year": 2018, "title": "ICAI Registered Firm Certification", "description": "Official recognition as a registered CA firm (Institute of Chartered Accountants of India)."},
]

CERTIFICATIONS = [
    {"name": "ICAI Registered Firm", "issuing_body": "Institute of Chartered Accountants of India (ICAI)", "description": "Proudly registered with the Institute of Chartered Accountants of India."},
    {"name": "ISO 9001:2015 Certified", "issuing_body": "International Organization for Standardization (ISO)", "description": "Quality Management System certified for consistent excellence."},
    {"name": "GST Authorized Partner", "issuing_body": "Goods and Services Tax Network (GSTN)", "description": "Authorized GST partner for seamless and reliable services."},
    {"name": "Udyam Registered", "issuing_body": "Ministry of MSME, Government of India", "description": "Registered under Udyam for empowering MSME growth."},
]

# Single source of truth for firm-wide figures. The frontend currently shows
# THREE conflicting sets of numbers:
#   - data/partners.js firmStats:       12+ Years / 1500+ Clients / 10000+ Filings / 99% Satisfaction
#   - Home/StatsSection.jsx:            12+ Years / 500+ Happy Clients / 100+ Team Members / 50+ Cities
#   - prose copy (HomeHero, WhyContactUs, AboutUsSnippet, Footer): "20+ years" /
#     "Two Decades" / "Since 2004" (2026 - 2004 = 22 years)
# "12+ years" only appears in the two placeholder-style stat arrays (partners.js
# even has a code comment admitting its numbers are unconfirmed placeholders);
# "20+ years" / "Two Decades" / "Since 2004" agree with each other across three
# independent copy blocks, so that's treated as authoritative here. Likewise
# "500+ clients" (StatsSection + AboutUsSnippet) is used over the lone "1500+"
# in partners.js. Flag both for a frontend copy fix once this table is wired up.
FIRM_STATS = [
    {"key": "years_of_experience", "label": "Years of Experience", "value": "20", "suffix": "+", "icon": "award", "sort_order": 1},
    {"key": "clients_served", "label": "Clients Served", "value": "500", "suffix": "+", "icon": "users", "sort_order": 2},
    {"key": "tax_filings", "label": "Tax Filings", "value": "10000", "suffix": "+", "icon": "filings", "sort_order": 3},
    {"key": "client_satisfaction", "label": "Client Satisfaction", "value": "99", "suffix": "%", "icon": "satisfaction", "sort_order": 4},
    {"key": "team_members", "label": "Team Members", "value": "100", "suffix": "+", "icon": "team", "sort_order": 5},
    {"key": "cities_covered", "label": "Cities Covered", "value": "50", "suffix": "+", "icon": "globe", "sort_order": 6},
]

JOB_OPENINGS = [
    {"title": "Chartered Accountant", "description": "Lead client engagements across audit, taxation, and advisory with full ownership and responsibility.", "requirements": "3+ Years", "min_experience_years": 3, "employment_type": "full_time"},
    {"title": "Article Assistant", "description": "Begin your CA articleship with hands-on exposure to audits, taxation, and compliance assignments.", "requirements": "Fresher / Pursuing CA", "min_experience_years": 0, "employment_type": "internship"},
    {"title": "Audit Executive", "description": "Support statutory and internal audits, ensuring accuracy and compliance across client accounts.", "requirements": "1-3 Years", "min_experience_years": 1, "employment_type": "full_time"},
    {"title": "Tax Associate", "description": "Assist with direct tax planning, return filing, and assessment support for individual and corporate clients.", "requirements": "1-2 Years", "min_experience_years": 1, "employment_type": "full_time"},
    {"title": "GST Executive", "description": "Handle GST registration, return filing, reconciliation, and compliance for a diverse client portfolio.", "requirements": "0-2 Years", "min_experience_years": 0, "employment_type": "full_time"},
]
JOB_LOCATION = "Roorkee, Uttarakhand"

# name, short_description (verbatim from each service's Hero.jsx), faqs (verbatim from each FAQSection.jsx)
SERVICES = [
    {
        "name": "GST Services",
        "short_description": "Provide end-to-end GST support, including GST registration, return filing, reconciliation, compliance monitoring and advisory services to help businesses stay compliant and focus on growth.",
        "faqs": [
            {"question": "Is GST registration mandatory?", "answer": "It's mandatory once your turnover crosses the prescribed threshold, or if you fall into certain specified categories regardless of turnover. We can assess whether your business needs to register."},
            {"question": "Which GST return should I file?", "answer": "It depends on your registration type and turnover -most businesses file GSTR-1 and GSTR-3B, with GSTR-9 as an annual return. We'll confirm exactly what applies to you."},
            {"question": "What is Input Tax Credit?", "answer": "Input Tax Credit lets you reduce the GST you owe on sales by the GST you've already paid on eligible business purchases, provided the claim is properly documented and matched."},
            {"question": "Can you handle GST notices?", "answer": "Yes. We help you understand what a notice is asking for, prepare an accurate response, and represent you where needed with the department."},
            {"question": "How often should GST returns be filed?", "answer": "Most businesses file monthly, though smaller taxpayers can opt into quarterly filing under the QRMP scheme. An annual return is also required on top of the periodic ones."},
            {"question": "Can you help with GST cancellation?", "answer": "Yes. If a registration is no longer needed, we manage the cancellation process end to end so it's closed out compliantly."},
        ],
    },
    {
        "name": "Income Tax & Advisory",
        "short_description": "From accurate income tax return filing to forward-looking tax planning, advisory and representation before tax authorities, our Chartered Accountants help individuals, professionals and businesses stay fully compliant while making the most of every legitimate tax benefit available to them.",
        "faqs": [
            {"question": "Which tax regime is better for a salary of ₹15 lakhs?", "answer": "It depends on how much you're able to claim in deductions. As a general guide, if your eligible deductions cross roughly ₹3.75 lakhs, the old regime tends to work out better; below that threshold, the new regime is usually more tax-efficient. We run the actual numbers for your specific income and deduction profile rather than applying a blanket rule."},
            {"question": "What is the penalty for late filing of an ITR?", "answer": "Filing after the due date -usually 31st July for individuals not subject to audit -attracts a late fee of up to ₹5,000 under Section 234F, along with interest on any outstanding tax under Section 234A. Late filers also lose the right to carry forward certain business and capital losses to future years."},
            {"question": "Can a company change its tax rate regime every year?", "answer": "No. Once a company opts for a concessional tax regime under Section 115BAA or 115BAB, that election is generally irrevocable and applies to all subsequent assessment years. We help you evaluate the decision carefully, weighing current and projected profitability, before you commit."},
            {"question": "What is the Annual Information Statement (AIS)?", "answer": "The AIS is a comprehensive statement of your financial transactions -salary, interest, dividends, mutual fund activity, property transactions and more -as reported to the Income Tax Department by banks, employers and other institutions. We reconcile it against your own records before filing to avoid mismatches and future notices."},
            {"question": "Can you help with tax notices?", "answer": "Yes. We regularly assist clients with income tax notices, scrutiny proceedings and assessments -helping them understand what's being asked, preparing a well-documented response, and representing their case before the tax authorities where required."},
            {"question": "Is my financial information confidential?", "answer": "Yes. Every client engagement is handled under strict confidentiality, and your financial information is never shared with any third party without your consent."},
        ],
    },
    {
        "name": "TDS Compliance",
        "short_description": "Quarterly TDS return filing and compliance support to help businesses and organisations meet applicable TDS requirements accurately and on time.",
        "faqs": [
            {"question": "Who is required to deduct TDS?", "answer": "Any business, organisation or individual (above the applicable audit threshold) making specified payments -such as salary, rent, professional fees or contract payments -above the prescribed limits must deduct TDS before payment."},
            {"question": "What happens if TDS is deducted but not deposited on time?", "answer": "Late deposit attracts interest for every month of delay, and repeated defaults can lead to penalties and prosecution in serious cases. We track due dates closely to keep this from happening."},
            {"question": "Which TDS return should I file?", "answer": "It depends on the type of payment -Form 24Q covers salary deductions, Form 26Q covers non-salary domestic payments, and Form 27Q covers payments to non-residents. We'll confirm exactly what applies to you."},
            {"question": "What is the difference between Form 16 and Form 16A?", "answer": "Form 16 is the annual TDS certificate issued to employees for salary deductions. Form 16A is issued quarterly for TDS deducted on non-salary payments, such as professional fees, rent or contract payments."},
            {"question": "Can you help with TDS notices or correction statements?", "answer": "Yes. We help you understand what a notice or mismatch is flagging, prepare an accurate correction statement, and represent you where needed with the department."},
            {"question": "How often are TDS returns filed?", "answer": "TDS returns are filed quarterly, with Form 16 issued annually after year-end and Form 16A issued each quarter. We manage the full cycle so nothing is missed."},
        ],
    },
    {
        "name": "Accounting & Bookkeeping",
        "short_description": "Professional bookkeeping and accounting services designed to maintain accurate financial records, prepare reliable financial statements, and provide businesses with a strong financial foundation for informed decision-making and long-term growth.",
        "faqs": [
            {"question": "Why is bookkeeping important?", "answer": "Bookkeeping is the foundation of every financial decision your business makes. Accurate records keep you compliant, reveal your real financial position, and make tax time and audits far less stressful."},
            {"question": "How often should financial records be updated?", "answer": "Ideally, transactions should be recorded as they happen, with a formal review monthly or quarterly. We tailor the frequency to your transaction volume and reporting needs."},
            {"question": "What financial reports do you prepare?", "answer": "We prepare profit & loss statements, balance sheets, cash flow statements, and other reports such as accounts payable/receivable summaries and expense breakdowns."},
            {"question": "Can you manage accounting remotely?", "answer": "Yes. We work with cloud-based accounting tools and secure document sharing, so your books can be maintained accurately regardless of where your business is located."},
            {"question": "Do you assist during audits?", "answer": "Yes. We keep your records audit-ready throughout the year and support you directly during statutory, tax or internal audits with the documentation auditors need."},
            {"question": "What accounting software do you support?", "answer": "We work with most major accounting platforms and can also adapt to the software your business already uses, so there's no disruptive migration required."},
            {"question": "How do you ensure data confidentiality?", "answer": "Your financial data is handled under strict internal confidentiality protocols, with controlled access and secure storage at every stage of the engagement."},
            {"question": "Do you provide monthly accounting services?", "answer": "Yes. We offer monthly, quarterly and annual accounting packages, each including reconciliation, reporting and a review of your financial position."},
        ],
    },
]


def seed_blog(snapshot):
    issues = []
    category_map = {}
    for name in snapshot["categories"]:
        cat, _ = get_or_create(BlogCategory, {"slug": slugify(name)}, {"name": name})
        category_map[name] = cat

    for name in snapshot["tags"]:
        get_or_create(BlogTag, {"slug": slugify(name)}, {"name": name})

    for post in snapshot["blogPosts"]:
        category = category_map.get(post["category"])
        if category is None:
            category, _ = get_or_create(BlogCategory, {"slug": slugify(post["category"])}, {"name": post["category"]})
            issues.append(f"blog_posts: '{post['slug']}' used category '{post['category']}' not in CATEGORIES list")

        author, _ = get_or_create(
            BlogAuthor,
            {"slug": slugify(post["author"])},
            {"name": post["author"], "designation": post.get("authorRole")},
        )

        image = get_or_create_media(post["featuredImage"], post["title"]) if post.get("featuredImage") else None

        published_at = datetime.strptime(post["publishDate"], "%Y-%m-%d").replace(tzinfo=timezone.utc)

        blog_post, created = get_or_create(
            BlogPost,
            {"slug": post["slug"]},
            {
                "title": post["title"],
                "excerpt": post["summary"],
                "content": post["content"],
                "featured_image_media_id": image.id if image else None,
                "category_id": category.id,
                "author_id": author.id,
                "status": "published",
                "published_at": published_at,
                "reading_time_minutes": post.get("readingTime"),
                "meta_title": post["title"],
                "meta_description": post["summary"][:320],
            },
        )

        tag_objs = []
        for tag_name in post.get("tags", []):
            tag, _ = get_or_create(BlogTag, {"slug": slugify(tag_name)}, {"name": tag_name})
            tag_objs.append(tag)
        blog_post.tags = tag_objs

        BlogKeyTakeaway.query.filter_by(post_id=blog_post.id).delete()
        for i, takeaway in enumerate(post.get("keyTakeaways", [])):
            db.session.add(BlogKeyTakeaway(post_id=blog_post.id, content=takeaway, sort_order=i))

        BlogFaq.query.filter_by(post_id=blog_post.id).delete()
        for i, faq in enumerate(post.get("faqs", [])):
            db.session.add(BlogFaq(post_id=blog_post.id, question=faq["question"], answer=faq["answer"], sort_order=i))

    db.session.flush()

    slugs = [p["slug"] for p in snapshot["blogPosts"]]
    if len(slugs) != len(set(slugs)):
        dupes = {s for s in slugs if slugs.count(s) > 1}
        issues.append(f"blog_posts: duplicate slugs in source data: {dupes}")

    return len(snapshot["blogPosts"]), issues


def seed_team(snapshot):
    issues = []
    count = 0
    for partner in snapshot["partners"]:
        photo = get_or_create_media(partner["image"], partner["name"]) if partner.get("image") else None
        social = partner.get("social", {})
        linkedin = social.get("linkedin")
        email = social.get("email")
        get_or_create(
            TeamMember,
            {"slug": slugify(partner["name"])},
            {
                "name": partner["name"],
                "designation": partner["designation"],
                "bio": partner["bio"],
                "qualifications": ", ".join(partner.get("qualifications", [])),
                "photo_media_id": photo.id if photo else None,
                "email": email if email and email != "#" else None,
                "linkedin_url": linkedin if linkedin and linkedin != "#" else None,
                "sort_order": partner["id"],
                "is_active": True,
                # partner id 1 (Amit Singh, Managing Director) is the
                # founding member and is pinned first/uneditable in the
                # admin panel - see TeamMember.is_protected.
                "is_protected": partner["id"] == 1,
            },
        )
        if email == "#" or linkedin == "#":
            issues.append(f"team_members: '{partner['name']}' has placeholder '#' social links in source data")
        count += 1
    return count, issues


def seed_testimonials():
    for i, t in enumerate(TESTIMONIALS):
        photo = get_or_create_media(t["photo"], t["client_name"])
        get_or_create(
            Testimonial,
            {"client_name": t["client_name"], "content": t["content"]},
            {
                "client_designation": t["client_designation"],
                "photo_media_id": photo.id,
                "is_featured": i == 0,
                "is_active": True,
                "sort_order": i,
            },
        )
    return len(TESTIMONIALS), []


def seed_awards():
    for i, a in enumerate(AWARDS):
        get_or_create(Award, {"title": a["title"], "year": a["year"]}, {"description": a["description"], "sort_order": i, "is_active": True})
    return len(AWARDS), []


def seed_certifications():
    for i, c in enumerate(CERTIFICATIONS):
        get_or_create(Certification, {"name": c["name"]}, {"issuing_body": c["issuing_body"], "description": c["description"], "sort_order": i, "is_active": True})
    return len(CERTIFICATIONS), []


def seed_firm_stats():
    for stat in FIRM_STATS:
        get_or_create(
            FirmStat,
            {"key": stat["key"]},
            {"label": stat["label"], "value": stat["value"], "suffix": stat["suffix"], "icon": stat["icon"], "sort_order": stat["sort_order"], "is_active": True},
        )
    return len(FIRM_STATS), [
        "firm_stats: resolved 3-way conflict on 'years of experience' (12+ vs 20+ vs 'Two Decades'/Since 2004) -> stored as 20",
        "firm_stats: resolved conflict on 'clients served' (500+ vs 1500+) -> stored as 500",
    ]


def seed_job_openings():
    for job in JOB_OPENINGS:
        get_or_create(
            JobOpening,
            {"slug": slugify(job["title"])},
            {
                "title": job["title"],
                "location": JOB_LOCATION,
                "employment_type": job["employment_type"],
                "description": job["description"],
                "requirements": job["requirements"],
                "min_experience_years": job["min_experience_years"],
                "is_active": True,
                "posted_at": datetime.now(timezone.utc),
            },
        )
    return len(JOB_OPENINGS), []


def seed_services():
    issues = ["services: full_description duplicated from the Hero copy - Overview.jsx's richer per-service sections were not migrated as the schema has no structured field for them"]
    count = 0
    for i, svc in enumerate(SERVICES):
        service, _ = get_or_create(
            Service,
            {"slug": slugify(svc["name"])},
            {
                "name": svc["name"],
                "short_description": svc["short_description"],
                "full_description": svc["short_description"],
                "sort_order": i,
                "is_active": True,
            },
        )
        ServiceFaq.query.filter_by(service_id=service.id).delete()
        for j, faq in enumerate(svc["faqs"]):
            db.session.add(ServiceFaq(service_id=service.id, question=faq["question"], answer=faq["answer"], sort_order=j))
        count += 1
    db.session.flush()
    return count, issues


def seed_admin():
    email = "admin@singhamitassociates.com"
    existing = Admin.query.filter_by(email=email).first()
    if existing:
        return existing, None
    password = secrets.token_urlsafe(12)
    admin = Admin(name="Site Administrator", email=email, password_hash=ph.hash(password), role="admin", is_active=True)
    db.session.add(admin)
    db.session.flush()
    return admin, password


def main():
    app = create_app()
    with app.app_context():
        snapshot = run_frontend_extraction()

        results = {}
        all_issues = []

        results["blog_categories"] = len(snapshot["categories"])
        results["blog_tags"] = len(snapshot["tags"])
        results["blog_posts"], issues = seed_blog(snapshot)
        all_issues += issues

        results["team_members"], issues = seed_team(snapshot)
        all_issues += issues

        results["testimonials"], issues = seed_testimonials()
        all_issues += issues

        results["awards"], issues = seed_awards()
        all_issues += issues

        results["certifications"], issues = seed_certifications()
        all_issues += issues

        results["firm_stats"], issues = seed_firm_stats()
        all_issues += issues

        results["job_openings"], issues = seed_job_openings()
        all_issues += issues

        results["services"], issues = seed_services()
        all_issues += issues

        admin, admin_password = seed_admin()

        db.session.commit()

        # --- Verification: real row counts + one sample record per table ---
        print("\n" + "=" * 70)
        print("VERIFICATION")
        print("=" * 70)
        counts = {
            "admins": Admin.query.count(),
            "media": Media.query.count(),
            "blog_categories": BlogCategory.query.count(),
            "blog_tags": BlogTag.query.count(),
            "blog_authors": BlogAuthor.query.count(),
            "blog_posts": BlogPost.query.count(),
            "blog_key_takeaways": BlogKeyTakeaway.query.count(),
            "blog_faqs": BlogFaq.query.count(),
            "team_members": TeamMember.query.count(),
            "testimonials": Testimonial.query.count(),
            "awards": Award.query.count(),
            "certifications": Certification.query.count(),
            "firm_stats": FirmStat.query.count(),
            "job_openings": JobOpening.query.count(),
            "services": Service.query.count(),
            "service_faqs": ServiceFaq.query.count(),
        }
        for table, count in counts.items():
            print(f"{table:22s} {count:5d} rows")

        sample_post = BlogPost.query.first()
        sample_team = TeamMember.query.first()
        sample_service = Service.query.first()
        print("\nSample blog_posts row:", sample_post.slug, "-", sample_post.title)
        print("Sample team_members row:", sample_team.name, "-", sample_team.designation)
        print("Sample services row:", sample_service.name)

        print("\n" + "=" * 70)
        print("SUMMARY (table -> rows inserted/updated)")
        print("=" * 70)
        for table, count in results.items():
            print(f"{table:22s} {count}")

        if all_issues:
            print("\nDATA ISSUES FOUND:")
            for issue in all_issues:
                print(f" - {issue}")

        if admin_password:
            print(f"\nSeeded admin user: {admin.email}")
            print(f"Generated password (save this now, it is not stored anywhere): {admin_password}")
        else:
            print(f"\nAdmin user already existed: {admin.email} (password unchanged)")


if __name__ == "__main__":
    main()
