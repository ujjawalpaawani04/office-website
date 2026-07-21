// Executes the frontend's JS data modules with real Node so template
// literals, spread objects (`...AUTHORS.amit`) and helper calls (`img(i)`)
// resolve exactly as they do in the running site, then dumps the result as
// JSON for seed_data.py to consume. Regenerated fresh on every seed run.
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, "..", "..", "frontend", "src", "data");
const outPath = join(here, "frontend_data.snapshot.json");

const { BLOG_POSTS } = await import(pathToFileURL(join(dataDir, "blog", "posts.js")));
const { CATEGORIES } = await import(pathToFileURL(join(dataDir, "blog", "categories.js")));
const { POPULAR_TAGS } = await import(pathToFileURL(join(dataDir, "blog", "tags.js")));
const { partners, firmStats } = await import(pathToFileURL(join(dataDir, "partners.js")));

writeFileSync(
  outPath,
  JSON.stringify({ blogPosts: BLOG_POSTS, categories: CATEGORIES, tags: POPULAR_TAGS, partners, firmStats }, null, 2),
);

console.log(`Wrote ${outPath}`);
console.log(`  blogPosts=${BLOG_POSTS.length} categories=${CATEGORIES.length} tags=${POPULAR_TAGS.length} partners=${partners.length} firmStats(legacy)=${firmStats.length}`);
