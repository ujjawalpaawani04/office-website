// React 19 hoists <title>/<meta>/<link> rendered anywhere in the tree into
// <head> automatically, so a page-level component can just render this and
// get correct per-page SEO metadata without a routing-level head manager.
//
// `canonicalPath` is a site-relative path (e.g. "/insights/some-slug");
// browsers resolve a relative `href` on <link rel="canonical"> against the
// current page URL, so no production domain needs to be hard-coded here.
export const Seo = ({ title, description, canonicalPath }) => {
  const fullTitle = `${title} | Singh Amit & Associates`;

  return (
    <>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {canonicalPath && <link rel="canonical" href={canonicalPath} />}
    </>
  );
};
