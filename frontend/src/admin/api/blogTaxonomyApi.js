import { createResourceApi } from "./createResourceApi";

export const blogCategoriesApi = createResourceApi("/admin/blog-categories");
export const blogTagsApi = createResourceApi("/admin/blog-tags");
export const blogAuthorsApi = createResourceApi("/admin/blog-authors");
