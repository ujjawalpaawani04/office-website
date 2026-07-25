import { useCallback, useState } from "react";
import { FiArrowLeft, FiPlus, FiSave, FiX } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError } from "../../../shared/api/client";
import {
  blogPostsApi,
  fetchBlogAuthorOptions,
  fetchBlogCategoryOptions,
  fetchBlogTagOptions,
} from "../../api/blogPostsApi";
import { describeSendResult, sendNewsletter } from "../../api/newsletterAdminApi";
import { Button } from "../../components/Button";
import { ErrorState } from "../../components/ErrorState";
import { NewsletterRecommendationModal } from "../../components/NewsletterRecommendationModal";
import { TextAreaField, TextField, SelectField } from "../../components/form/Field";
import { MarkdownEditor } from "../../components/MarkdownEditor";
import { MediaPicker } from "../../components/MediaPicker";
import { Skeleton } from "../../components/Skeleton";
import { TagMultiSelect } from "../../components/TagMultiSelect";
import { SITE_URL } from "../../config/env";
import { useAsyncData } from "../../hooks/useAsyncData";
import { slugify } from "../../utils/slugify";
import { useBreadcrumb } from "../../layouts/useBreadcrumb";
import { useToast } from "../../toast/useToast";

function formFromPost(post) {
  if (!post) {
    return {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      status: "draft",
      categoryId: "",
      authorId: "",
      tagIds: [],
      keyTakeaways: [],
      faqs: [],
      metaTitle: "",
      metaDescription: "",
    };
  }
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt || "",
    content: post.content,
    status: post.status,
    categoryId: post.categoryId || "",
    authorId: post.authorId || "",
    tagIds: post.tags.map((t) => t.id),
    keyTakeaways: post.keyTakeaways,
    faqs: post.faqs,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
  };
}

export default function BlogPostEditor() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const { showToast } = useToast();
  useBreadcrumb([{ label: "Blog Posts", to: "/admin/blog/posts" }, { label: isNew ? "New Post" : "Edit Post" }]);

  // Lives here (not in EditorForm) because a new post's save navigates to
  // its own edit URL, which remounts EditorForm via its `key={id}` below -
  // the recommendation popup would vanish with it if state lived there.
  const [suggestion, setSuggestion] = useState(null);
  const [sendingNewsletter, setSendingNewsletter] = useState(false);

  const loadAll = useCallback(async () => {
    const [categories, tags, authors, post] = await Promise.all([
      fetchBlogCategoryOptions(),
      fetchBlogTagOptions(),
      fetchBlogAuthorOptions(),
      isNew ? Promise.resolve(null) : blogPostsApi.get(id),
    ]);
    return { categories, tags, authors, post };
  }, [id, isNew]);
  const { data, error, loading, refetch } = useAsyncData(loadAll);

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
    <div>
      {error ? <ErrorState message="Could not load the post editor." onRetry={refetch} /> : <EditorSkeleton />}
    </div>
  ) : (
    <>
      <EditorForm
        key={id}
        isNew={isNew}
        post={data.post}
        categories={data.categories}
        tags={data.tags}
        authors={data.authors}
        onSaved={(savedId) => {
          showToast(isNew ? "Post created." : "Post updated.");
          if (isNew) navigate(`/admin/blog/posts/${savedId}`, { replace: true });
        }}
        onSuggestion={setSuggestion}
        onCancel={() => navigate("/admin/blog/posts")}
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

function EditorForm({ isNew, post, categories, tags, authors, onSaved, onSuggestion, onCancel }) {
  const { showToast } = useToast();
  const [form, setForm] = useState(() => formFromPost(post));
  const [featuredImage, setFeaturedImage] = useState(() =>
    post?.featuredImageMediaId ? { mediaId: post.featuredImageMediaId, url: post.featuredImageUrl } : null
  );
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [warnings, setWarnings] = useState([]);
  const [takeawayDraft, setTakeawayDraft] = useState("");
  const [faqDraft, setFaqDraft] = useState({ question: "", answer: "" });

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (value) => {
    setField("title", value);
    if (!slugTouched) setField("slug", slugify(value));
  };

  const addTakeaway = () => {
    if (!takeawayDraft.trim()) return;
    setField("keyTakeaways", [...form.keyTakeaways, takeawayDraft.trim()]);
    setTakeawayDraft("");
  };

  const addFaq = () => {
    if (!faqDraft.question.trim() || !faqDraft.answer.trim()) return;
    setField("faqs", [...form.faqs, faqDraft]);
    setFaqDraft({ question: "", answer: "" });
  };

  const save = async (statusOverride) => {
    setSaving(true);
    setErrors({});
    setWarnings([]);
    const payload = {
      ...form,
      status: statusOverride || form.status,
      featuredImageMediaId: featuredImage?.mediaId || null,
    };
    try {
      const result = isNew ? await blogPostsApi.create(payload) : await blogPostsApi.update(post.id, payload);
      if (result.warnings) setWarnings(result.warnings);
      if (result.newsletterSuggestion?.shouldPrompt) {
        onSuggestion({
          ...result.newsletterSuggestion,
          subject: result.title,
          summary: result.excerpt || result.title,
          ctaUrl: `${SITE_URL}/blog/${result.slug}`,
          ctaLabel: "Read More",
          sourceType: "blog_post",
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
    <form
      onSubmit={(e) => { e.preventDefault(); save(); }}
      className="grid gap-6 pb-10 lg:grid-cols-[1fr_320px]"
    >
      <div className="space-y-4">
        {warnings.map((w) => (
          <div key={w} role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5 text-sm text-amber-700">
            {w}
          </div>
        ))}
        <TextField id="bp-title" label="Title" required value={form.title} error={errors.title} onChange={(e) => handleTitleChange(e.target.value)} />
        <TextField id="bp-slug" label="Slug" required value={form.slug} error={errors.slug} onChange={(e) => { setSlugTouched(true); setField("slug", e.target.value); }} />
        <TextAreaField id="bp-excerpt" label="Excerpt" rows={2} value={form.excerpt} error={errors.excerpt} onChange={(e) => setField("excerpt", e.target.value)} />
        <MarkdownEditor id="bp-content" label="Content" value={form.content} error={errors.content} onChange={(v) => setField("content", v)} />

        <div className="rounded-xl border border-secondary/10 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">Key Takeaways</p>
          <ul className="mb-3 space-y-2">
            {form.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-2 rounded-lg bg-secondary/5 px-3 py-2 text-sm text-secondary">
                {item}
                <button type="button" onClick={() => setField("keyTakeaways", form.keyTakeaways.filter((_, idx) => idx !== i))} aria-label="Remove">
                  <FiX className="h-4 w-4 text-secondary/40" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              value={takeawayDraft}
              onChange={(e) => setTakeawayDraft(e.target.value)}
              placeholder="Add a takeaway..."
              className="flex-1 rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
            />
            <Button type="button" variant="secondary" onClick={addTakeaway}><FiPlus className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="rounded-xl border border-secondary/10 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">FAQs</p>
          <ul className="mb-3 space-y-2">
            {form.faqs.map((faq, i) => (
              <li key={i} className="rounded-lg bg-secondary/5 px-3 py-2 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-secondary">{faq.question}</p>
                  <button type="button" onClick={() => setField("faqs", form.faqs.filter((_, idx) => idx !== i))} aria-label="Remove">
                    <FiX className="h-4 w-4 shrink-0 text-secondary/40" />
                  </button>
                </div>
                <p className="mt-0.5 text-secondary/60">{faq.answer}</p>
              </li>
            ))}
          </ul>
          <div className="space-y-2">
            <input
              value={faqDraft.question}
              onChange={(e) => setFaqDraft((prev) => ({ ...prev, question: e.target.value }))}
              placeholder="Question"
              className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
            />
            <textarea
              value={faqDraft.answer}
              onChange={(e) => setFaqDraft((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Answer"
              rows={2}
              className="w-full rounded-lg border border-secondary/15 px-3 py-2 text-sm focus:border-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-700/15"
            />
            <Button type="button" variant="secondary" onClick={addFaq}><FiPlus className="h-4 w-4" /> Add FAQ</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-secondary/10 bg-white p-4">
          <SelectField id="bp-status" label="Status" value={form.status} onChange={(e) => setField("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </SelectField>
          <div className="mt-4">
            <MediaPicker label="Featured Image" value={featuredImage} onChange={setFeaturedImage} />
          </div>
          <div className="mt-4">
            <SelectField id="bp-category" label="Category" value={form.categoryId} onChange={(e) => setField("categoryId", e.target.value)}>
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </SelectField>
          </div>
          <div className="mt-4">
            <SelectField id="bp-author" label="Author" value={form.authorId} onChange={(e) => setField("authorId", e.target.value)}>
              <option value="">None</option>
              {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </SelectField>
          </div>
          <div className="mt-4">
            <TagMultiSelect label="Tags" options={tags} value={form.tagIds} onChange={(v) => setField("tagIds", v)} />
          </div>
        </div>

        <div className="rounded-xl border border-secondary/10 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-secondary/70">SEO</p>
          <TextField id="bp-meta-title" label="Meta Title" value={form.metaTitle} error={errors.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} />
          <div className="mt-4">
            <TextAreaField id="bp-meta-description" label="Meta Description" rows={3} value={form.metaDescription} error={errors.metaDescription} onChange={(e) => setField("metaDescription", e.target.value)} />
          </div>
        </div>

        <div className="sticky bottom-4 flex flex-col gap-2 rounded-xl border border-secondary/10 bg-white p-4 shadow-sm">
          <Button type="submit" loading={saving}>
            <FiSave className="h-4 w-4" /> Save
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            <FiArrowLeft className="h-4 w-4" /> Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
