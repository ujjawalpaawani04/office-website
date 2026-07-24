import { useCallback, useState } from "react";
import { FiArrowLeft, FiEye, FiPlus, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "../../../api/client";
import { ServicePage } from "../../../pages/Services/serviceTemplate/ServicePage";
import { buildServiceConfig } from "../../../pages/Services/DynamicServicePage";
import { describeSendResult, sendNewsletter } from "../../api/newsletterAdminApi";
import { servicesApi } from "../../api/servicesApi";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { IconPicker } from "../../components/IconPicker";
import { MediaPicker } from "../../components/MediaPicker";
import { NewsletterRecommendationModal } from "../../components/NewsletterRecommendationModal";
import { Skeleton } from "../../components/Skeleton";
import { SortableRepeater } from "../../components/SortableRepeater";
import { SelectField, TextAreaField, TextField, ToggleField } from "../../components/form/Field";
import { SITE_URL } from "../../config/env";
import { useAsyncData } from "../../hooks/useAsyncData";
import { useBreadcrumb } from "../../layout/useBreadcrumb";
import { slugify } from "../../utils/slugify";
import { useToast } from "../../toast/useToast";

let keyCounter = 0;
const nextKey = () => `k${Date.now()}_${keyCounter++}`;
const withKeys = (items) => (items || []).map((item) => ({ ...item, _key: nextKey() }));
const stripKeys = (items) => items.map(({ _key, ...rest }) => rest);

function formFromService(service) {
  if (!service) {
    return {
      name: "",
      slug: "",
      category: "our_services",
      badgeLabel: "",
      shortDescription: "",
      fullDescription: "",
      icon: "",
      sortOrder: 0,
      isActive: true,
      heroBreadcrumbLabel: "",
      heroTitlePrefix: "",
      heroTitleHighlight: "",
      heroDescription: "",
      overviewTagline: "",
      overviewHeadingPrefix: "",
      overviewHeadingHighlight: "",
      overviewParagraphs: [],
      overviewHighlights: [],
      featuresTagline: "",
      featuresHeadingPrefix: "",
      featuresHeadingHighlight: "",
      featuresIntro: "",
      features: [],
      processIntro: "",
      process: [],
      whyChooseUsIntro: "",
      whyChooseUsImageAlt: "",
      whyChooseUs: [],
      benefitsTagline: "",
      benefitsHeadingPrefix: "",
      benefitsHeadingHighlight: "",
      benefitsIntro: "",
      benefits: [],
      industriesIntro: "",
      industries: [],
      faqs: [],
      ctaHeading: "",
      ctaDescription: "",
      ctaPrimaryLabel: "",
      seoTitle: "",
      metaDescription: "",
      metaKeywords: "",
      canonicalUrl: "",
    };
  }
  return {
    name: service.name,
    slug: service.slug,
    category: service.category,
    badgeLabel: service.badgeLabel || "",
    shortDescription: service.shortDescription || "",
    fullDescription: service.fullDescription || "",
    icon: service.icon || "",
    sortOrder: service.sortOrder ?? 0,
    isActive: service.isActive,
    heroBreadcrumbLabel: service.heroBreadcrumbLabel || "",
    heroTitlePrefix: service.heroTitlePrefix || "",
    heroTitleHighlight: service.heroTitleHighlight || "",
    heroDescription: service.heroDescription || "",
    overviewTagline: service.overviewTagline || "",
    overviewHeadingPrefix: service.overviewHeadingPrefix || "",
    overviewHeadingHighlight: service.overviewHeadingHighlight || "",
    overviewParagraphs: withKeys((service.overviewParagraphs || []).map((content) => ({ content }))),
    overviewHighlights: withKeys((service.overviewHighlights || []).map((content) => ({ content }))),
    featuresTagline: service.featuresTagline || "",
    featuresHeadingPrefix: service.featuresHeadingPrefix || "",
    featuresHeadingHighlight: service.featuresHeadingHighlight || "",
    featuresIntro: service.featuresIntro || "",
    features: withKeys(service.features),
    processIntro: service.processIntro || "",
    process: withKeys(service.process),
    whyChooseUsIntro: service.whyChooseUsIntro || "",
    whyChooseUsImageAlt: service.whyChooseUsImageAlt || "",
    whyChooseUs: withKeys(service.whyChooseUs),
    benefitsTagline: service.benefitsTagline || "",
    benefitsHeadingPrefix: service.benefitsHeadingPrefix || "",
    benefitsHeadingHighlight: service.benefitsHeadingHighlight || "",
    benefitsIntro: service.benefitsIntro || "",
    benefits: withKeys(service.benefits),
    industriesIntro: service.industriesIntro || "",
    industries: withKeys(service.industries),
    faqs: withKeys(service.faqs),
    ctaHeading: service.ctaHeading || "",
    ctaDescription: service.ctaDescription || "",
    ctaPrimaryLabel: service.ctaPrimaryLabel || "",
    seoTitle: service.seoTitle || "",
    metaDescription: service.metaDescription || "",
    metaKeywords: service.metaKeywords || "",
    canonicalUrl: service.canonicalUrl || "",
  };
}

export default function ServiceEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { showToast } = useToast();
  useBreadcrumb([{ label: "Services", to: "/admin/services" }, { label: isNew ? "New Service" : "Edit Service" }]);

  const [suggestion, setSuggestion] = useState(null);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const loadService = useCallback(() => (isNew ? Promise.resolve(null) : servicesApi.get(id)), [id, isNew]);
  const { data: service, error, loading, refetch } = useAsyncData(loadService);

  const handleSendNewsletter = async () => {
    setSendingNewsletter(true);
    try {
      const result = await sendNewsletter(suggestion);
      showToast(describeSendResult(result), result.successCount > 0 ? "success" : "error");
      setSuggestion(null);
    } catch (err) {
      showToast(err instanceof ApiError ? err.message : "Could not send the newsletter.", "error");
    } finally {
      setSendingNewsletter(false);
    }
  };

  return loading || error ? (
    <div>{error ? <ErrorState message="Could not load the service." onRetry={refetch} /> : <EditorSkeleton />}</div>
  ) : (
    <>
      <EditorForm
        key={id}
        isNew={isNew}
        service={service}
        onSaved={(savedId) => {
          showToast(isNew ? "Service created." : "Service updated.");
          if (isNew) navigate(`/admin/services/${savedId}`, { replace: true });
        }}
        onSuggestion={setSuggestion}
        onCancel={() => navigate("/admin/services")}
      />
      <NewsletterRecommendationModal
        open={Boolean(suggestion)}
        suggestion={suggestion}
        sending={sendingNewsletter}
        onSend={handleSendNewsletter}
        onSkip={() => setSuggestion(null)}
      />
    </>
  );
}

function EditorSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function EditorForm({ isNew, service, onSaved, onSuggestion, onCancel }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromService(service));
  const [featuredImage, setFeaturedImage] = useState(() =>
    service?.featuredImageMediaId ? { mediaId: service.featuredImageMediaId, url: service.featuredImageUrl } : null
  );
  const [heroImage, setHeroImage] = useState(() =>
    service?.heroBackgroundMediaId ? { mediaId: service.heroBackgroundMediaId, url: service.heroBackgroundImageUrl } : null
  );
  const [whyChooseUsImage, setWhyChooseUsImage] = useState(() =>
    service?.whyChooseUsImageMediaId
      ? { mediaId: service.whyChooseUsImageMediaId, url: service.whyChooseUsImageUrl }
      : null
  );
  const [ogImage, setOgImage] = useState(() =>
    service?.ogImageMediaId ? { mediaId: service.ogImageMediaId, url: service.ogImageUrl } : null
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const [errors, setErrors] = useState({});
  const [warnings, setWarnings] = useState([]);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleNameChange = (value) => {
    setField("name", value);
    if (!slugTouched) setField("slug", slugify(value));
  };

  const save = async () => {
    setSaving(true);
    setErrors({});
    setWarnings([]);
    const payload = {
      ...form,
      featuredImageMediaId: featuredImage?.mediaId || null,
      heroBackgroundMediaId: heroImage?.mediaId || null,
      whyChooseUsImageMediaId: whyChooseUsImage?.mediaId || null,
      ogImageMediaId: ogImage?.mediaId || null,
      overviewParagraphs: stripKeys(form.overviewParagraphs).map((p) => p.content),
      overviewHighlights: stripKeys(form.overviewHighlights).map((h) => h.content),
      features: stripKeys(form.features),
      process: stripKeys(form.process),
      whyChooseUs: stripKeys(form.whyChooseUs),
      benefits: stripKeys(form.benefits),
      industries: stripKeys(form.industries),
      faqs: stripKeys(form.faqs),
    };
    try {
      const result = isNew ? await servicesApi.create(payload) : await servicesApi.update(service.id, payload);
      if (result.warnings) setWarnings(result.warnings);
      if (result.newsletterSuggestion?.shouldPrompt) {
        onSuggestion({
          ...result.newsletterSuggestion,
          subject: result.name,
          summary: result.shortDescription || result.name,
          ctaUrl: `${SITE_URL}/services/${result.slug}`,
          ctaLabel: "Learn More",
          sourceType: "service",
          sourceId: result.id,
        });
      }
      onSaved(result.id);
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setErrors(err.body?.fields || {});
        showToast("Couldn't save - check the highlighted fields.", "error");
      } else {
        showToast(err instanceof ApiError ? err.message : "Could not save.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); save(); }} className="grid gap-6 pb-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {warnings.map((w) => (
            <div key={w} role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
              {w}
            </div>
          ))}

          <Section title="General">
            <TextField id="svc-name" label="Name" required value={form.name} error={errors.name} onChange={(e) => handleNameChange(e.target.value)} />
            <Field2>
              <TextField id="svc-slug" label="Slug" required value={form.slug} error={errors.slug} onChange={(e) => { setSlugTouched(true); setField("slug", e.target.value); }} />
            </Field2>
            <Field2>
              <TextAreaField id="svc-short" label="Short Description" rows={2} value={form.shortDescription} error={errors.shortDescription} onChange={(e) => setField("shortDescription", e.target.value)} />
            </Field2>
            <Field2>
              <TextAreaField id="svc-full" label="Full Description" rows={4} value={form.fullDescription} error={errors.fullDescription} onChange={(e) => setField("fullDescription", e.target.value)} />
            </Field2>
            <Field2>
              <IconPicker label="Icon" value={form.icon} onChange={(v) => setField("icon", v || "")} />
            </Field2>
          </Section>

          <Section title="Hero">
            <MediaPicker label="Background Image" value={heroImage} onChange={setHeroImage} />
            <Field2>
              <TextField id="svc-hero-breadcrumb" label="Breadcrumb Title" value={form.heroBreadcrumbLabel} onChange={(e) => setField("heroBreadcrumbLabel", e.target.value)} />
            </Field2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField id="svc-hero-prefix" label="Hero Title" value={form.heroTitlePrefix} onChange={(e) => setField("heroTitlePrefix", e.target.value)} />
              <TextField id="svc-hero-highlight" label="Hero Title (highlighted part)" value={form.heroTitleHighlight} onChange={(e) => setField("heroTitleHighlight", e.target.value)} />
            </div>
            <Field2>
              <TextAreaField id="svc-hero-desc" label="Hero Description" rows={3} value={form.heroDescription} onChange={(e) => setField("heroDescription", e.target.value)} />
            </Field2>
          </Section>

          <Section title="Introduction / Overview">
            <TextField id="svc-ov-tagline" label="Tagline" value={form.overviewTagline} onChange={(e) => setField("overviewTagline", e.target.value)} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField id="svc-ov-prefix" label="Heading" value={form.overviewHeadingPrefix} onChange={(e) => setField("overviewHeadingPrefix", e.target.value)} />
              <TextField id="svc-ov-highlight" label="Heading (highlighted part)" value={form.overviewHeadingHighlight} onChange={(e) => setField("overviewHeadingHighlight", e.target.value)} />
            </div>
            <Field2>
              <StringRepeater
                label="Paragraphs"
                placeholder="Add a paragraph..."
                multiline
                items={form.overviewParagraphs}
                onChange={(items) => setField("overviewParagraphs", items)}
              />
            </Field2>
            <Field2>
              <StringRepeater
                label="Highlights"
                placeholder="Add a highlight..."
                items={form.overviewHighlights}
                onChange={(items) => setField("overviewHighlights", items)}
              />
            </Field2>
          </Section>

          <Section title="Features">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="svc-feat-tagline" label="Tagline" value={form.featuresTagline} onChange={(e) => setField("featuresTagline", e.target.value)} />
              <TextField id="svc-feat-prefix" label="Heading" value={form.featuresHeadingPrefix} onChange={(e) => setField("featuresHeadingPrefix", e.target.value)} />
              <TextField id="svc-feat-highlight" label="Heading (highlighted part)" value={form.featuresHeadingHighlight} onChange={(e) => setField("featuresHeadingHighlight", e.target.value)} />
              <TextField id="svc-feat-intro" label="Intro" value={form.featuresIntro} onChange={(e) => setField("featuresIntro", e.target.value)} />
            </div>
            <Field2>
              <IconItemsRepeater items={form.features} onChange={(items) => setField("features", items)} />
            </Field2>
          </Section>

          <Section title="Process">
            <TextAreaField id="svc-process-intro" label="Intro" rows={2} value={form.processIntro} onChange={(e) => setField("processIntro", e.target.value)} />
            <Field2>
              <IconItemsRepeater items={form.process} onChange={(items) => setField("process", items)} />
            </Field2>
          </Section>

          <Section title="Why Choose Us">
            <MediaPicker label="Image" value={whyChooseUsImage} onChange={setWhyChooseUsImage} />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <TextField id="svc-wcu-alt" label="Image Alt Text" value={form.whyChooseUsImageAlt} onChange={(e) => setField("whyChooseUsImageAlt", e.target.value)} />
              <TextField id="svc-wcu-intro" label="Intro" value={form.whyChooseUsIntro} onChange={(e) => setField("whyChooseUsIntro", e.target.value)} />
            </div>
            <Field2>
              <IconItemsRepeater items={form.whyChooseUs} onChange={(items) => setField("whyChooseUs", items)} />
            </Field2>
          </Section>

          <Section title="Benefits">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField id="svc-ben-tagline" label="Tagline" value={form.benefitsTagline} onChange={(e) => setField("benefitsTagline", e.target.value)} />
              <TextField id="svc-ben-prefix" label="Heading" value={form.benefitsHeadingPrefix} onChange={(e) => setField("benefitsHeadingPrefix", e.target.value)} />
              <TextField id="svc-ben-highlight" label="Heading (highlighted part)" value={form.benefitsHeadingHighlight} onChange={(e) => setField("benefitsHeadingHighlight", e.target.value)} />
              <TextField id="svc-ben-intro" label="Intro" value={form.benefitsIntro} onChange={(e) => setField("benefitsIntro", e.target.value)} />
            </div>
            <Field2>
              <IconItemsRepeater items={form.benefits} onChange={(items) => setField("benefits", items)} descriptionOptional />
            </Field2>
          </Section>

          <Section title="Industries">
            <TextAreaField id="svc-ind-intro" label="Intro" rows={2} value={form.industriesIntro} onChange={(e) => setField("industriesIntro", e.target.value)} />
            <Field2>
              <IconItemsRepeater
                items={form.industries}
                onChange={(items) => setField("industries", items)}
                titleKey="label"
                descriptionKey="blurb"
                titleLabel="Label"
                descriptionLabel="Blurb"
              />
            </Field2>
          </Section>

          <Section title="FAQ">
            <FaqRepeater items={form.faqs} onChange={(items) => setField("faqs", items)} />
          </Section>

          <Section title="CTA">
            <TextField id="svc-cta-heading" label="Heading" value={form.ctaHeading} onChange={(e) => setField("ctaHeading", e.target.value)} />
            <Field2>
              <TextAreaField id="svc-cta-desc" label="Description" rows={2} value={form.ctaDescription} onChange={(e) => setField("ctaDescription", e.target.value)} />
            </Field2>
            <Field2>
              <TextField id="svc-cta-btn" label="Button Text" value={form.ctaPrimaryLabel} placeholder="Schedule Consultation" onChange={(e) => setField("ctaPrimaryLabel", e.target.value)} />
            </Field2>
          </Section>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-secondary/10 bg-white p-4">
            <SelectField id="svc-category" label="Category" value={form.category} onChange={(e) => setField("category", e.target.value)}>
              <option value="our_services">Our Services</option>
              <option value="corporate_specialised">Corporate & Specialised Services</option>
            </SelectField>
            <div className="mt-4">
              <TextField id="svc-badge" label="Badge Label" placeholder="e.g. Specialised" value={form.badgeLabel} onChange={(e) => setField("badgeLabel", e.target.value)} />
            </div>
            <div className="mt-4">
              <TextField id="svc-sort" label="Sort Order" type="number" value={form.sortOrder} onChange={(e) => setField("sortOrder", Number(e.target.value))} />
            </div>
            <div className="mt-4">
              <MediaPicker label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
            </div>
            <div className="mt-4">
              <ToggleField id="svc-active" label="Published" description="Visible on the live site" checked={form.isActive} onChange={(v) => setField("isActive", v)} />
            </div>
          </div>

          <div className="rounded-xl border border-secondary/10 bg-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">SEO</p>
            <TextField id="svc-seo-title" label="SEO Title" value={form.seoTitle} onChange={(e) => setField("seoTitle", e.target.value)} />
            <div className="mt-4">
              <TextAreaField id="svc-seo-desc" label="Meta Description" rows={3} value={form.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} />
            </div>
            <div className="mt-4">
              <TextField id="svc-seo-keywords" label="Meta Keywords" value={form.metaKeywords} onChange={(e) => setField("metaKeywords", e.target.value)} />
            </div>
            <div className="mt-4">
              <TextField id="svc-canonical" label="Canonical URL" value={form.canonicalUrl} onChange={(e) => setField("canonicalUrl", e.target.value)} />
            </div>
            <div className="mt-4">
              <MediaPicker label="Open Graph Image" value={ogImage} onChange={setOgImage} />
            </div>
          </div>

          <div className="sticky bottom-4 flex flex-col gap-2 rounded-xl border border-secondary/10 bg-white p-4 shadow-sm">
            <Button type="button" variant="secondary" onClick={() => setShowPreview(true)}>
              <FiEye className="h-4 w-4" /> Preview
            </Button>
            <Button type="submit" loading={saving}>
              <FiSave className="h-4 w-4" /> Save
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              <FiArrowLeft className="h-4 w-4" /> Cancel
            </Button>
          </div>
        </div>
      </form>

      {showPreview ? (
        <PreviewOverlay
          config={buildServiceConfig({
            ...form,
            overviewParagraphs: stripKeys(form.overviewParagraphs).map((p) => p.content),
            overviewHighlights: stripKeys(form.overviewHighlights).map((h) => h.content),
            features: stripKeys(form.features),
            process: stripKeys(form.process),
            whyChooseUs: stripKeys(form.whyChooseUs),
            benefits: stripKeys(form.benefits),
            industries: stripKeys(form.industries),
            faqs: stripKeys(form.faqs),
            heroBackgroundImageUrl: heroImage?.url,
            whyChooseUsImageUrl: whyChooseUsImage?.url,
          })}
          onClose={() => setShowPreview(false)}
        />
      ) : null}
    </>
  );
}

function Section({ title, children }) {
  return (
    <div className="rounded-xl border border-secondary/10 bg-white p-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">{title}</p>
      {children}
    </div>
  );
}

function Field2({ children }) {
  return <div className="mt-4">{children}</div>;
}

function StringRepeater({ label, placeholder, items, onChange, multiline }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...items, { content: draft.trim(), _key: nextKey() }]);
    setDraft("");
  };
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-secondary/70">{label}</p>
      {items.length > 0 ? (
        <div className="mb-2">
          <SortableRepeater
            items={items}
            getId={(item) => item._key}
            onReorder={onChange}
            onRemove={(index) => onChange(items.filter((_, i) => i !== index))}
            renderItem={(item, index) =>
              multiline ? (
                <textarea
                  value={item.content}
                  rows={2}
                  onChange={(e) => onChange(items.map((it, i) => (i === index ? { ...it, content: e.target.value } : it)))}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
              ) : (
                <input
                  value={item.content}
                  onChange={(e) => onChange(items.map((it, i) => (i === index ? { ...it, content: e.target.value } : it)))}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
              )
            }
          />
        </div>
      ) : null}
      <div className="flex gap-2">
        {multiline ? (
          <textarea
            value={draft}
            rows={2}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
          />
        ) : (
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
          />
        )}
        <Button type="button" variant="secondary" onClick={add}>
          <FiPlus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function IconItemsRepeater({
  items,
  onChange,
  titleKey = "title",
  descriptionKey = "description",
  titleLabel = "Title",
  descriptionLabel = "Description",
  descriptionOptional = false,
}) {
  const [draft, setDraft] = useState({ icon: "", [titleKey]: "", [descriptionKey]: "" });

  const add = () => {
    if (!draft[titleKey]?.trim()) return;
    onChange([...items, { ...draft, _key: nextKey() }]);
    setDraft({ icon: "", [titleKey]: "", [descriptionKey]: "" });
  };

  const updateItem = (index, patch) => onChange(items.map((it, i) => (i === index ? { ...it, ...patch } : it)));

  return (
    <div>
      {items.length > 0 ? (
        <div className="mb-3">
          <SortableRepeater
            items={items}
            getId={(item) => item._key}
            onReorder={onChange}
            onRemove={(index) => onChange(items.filter((_, i) => i !== index))}
            renderItem={(item, index) => (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <IconPicker value={item.icon} onChange={(v) => updateItem(index, { icon: v || "" })} />
                </div>
                <input
                  value={item[titleKey] || ""}
                  placeholder={titleLabel}
                  onChange={(e) => updateItem(index, { [titleKey]: e.target.value })}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm font-medium focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
                <textarea
                  value={item[descriptionKey] || ""}
                  placeholder={descriptionLabel + (descriptionOptional ? " (optional)" : "")}
                  rows={2}
                  onChange={(e) => updateItem(index, { [descriptionKey]: e.target.value })}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
              </div>
            )}
          />
        </div>
      ) : null}

      <div className="space-y-2 rounded-lg border border-dashed border-secondary/20 p-3">
        <IconPicker label="Icon" value={draft.icon} onChange={(v) => setDraft((prev) => ({ ...prev, icon: v || "" }))} />
        <input
          value={draft[titleKey]}
          placeholder={titleLabel}
          onChange={(e) => setDraft((prev) => ({ ...prev, [titleKey]: e.target.value }))}
          className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        />
        <textarea
          value={draft[descriptionKey]}
          placeholder={descriptionLabel + (descriptionOptional ? " (optional)" : "")}
          rows={2}
          onChange={(e) => setDraft((prev) => ({ ...prev, [descriptionKey]: e.target.value }))}
          className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        />
        <Button type="button" variant="secondary" onClick={add}>
          <FiPlus className="h-4 w-4" /> Add
        </Button>
      </div>
    </div>
  );
}

function FaqRepeater({ items, onChange }) {
  const [draft, setDraft] = useState({ question: "", answer: "" });

  const add = () => {
    if (!draft.question.trim() || !draft.answer.trim()) return;
    onChange([...items, { ...draft, _key: nextKey() }]);
    setDraft({ question: "", answer: "" });
  };

  return (
    <div>
      {items.length > 0 ? (
        <div className="mb-3">
          <SortableRepeater
            items={items}
            getId={(item) => item._key}
            onReorder={onChange}
            onRemove={(index) => onChange(items.filter((_, i) => i !== index))}
            renderItem={(item, index) => (
              <div className="space-y-2">
                <input
                  value={item.question}
                  placeholder="Question"
                  onChange={(e) => onChange(items.map((it, i) => (i === index ? { ...it, question: e.target.value } : it)))}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm font-medium focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
                <textarea
                  value={item.answer}
                  placeholder="Answer"
                  rows={2}
                  onChange={(e) => onChange(items.map((it, i) => (i === index ? { ...it, answer: e.target.value } : it)))}
                  className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
                />
              </div>
            )}
          />
        </div>
      ) : null}

      <div className="space-y-2 rounded-lg border border-dashed border-secondary/20 p-3">
        <input
          value={draft.question}
          onChange={(e) => setDraft((prev) => ({ ...prev, question: e.target.value }))}
          placeholder="Question"
          className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        />
        <textarea
          value={draft.answer}
          onChange={(e) => setDraft((prev) => ({ ...prev, answer: e.target.value }))}
          placeholder="Answer"
          rows={2}
          className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
        />
        <Button type="button" variant="secondary" onClick={add}>
          <FiPlus className="h-4 w-4" /> Add FAQ
        </Button>
      </div>
    </div>
  );
}

function PreviewOverlay({ config, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-secondary/10 bg-white px-5 py-3 shadow-sm">
        <p className="text-sm font-semibold text-secondary">Preview (unsaved changes) - this is not the live page</p>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-secondary/15 px-3 py-1.5 text-sm font-medium text-secondary hover:bg-secondary/5"
        >
          <FiX className="h-4 w-4" /> Close Preview
        </button>
      </div>
      <ServicePage config={config} />
    </div>
  );
}
