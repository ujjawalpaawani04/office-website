import { FiTag } from "react-icons/fi";
import { blogTagsApi } from "../../api/blogTaxonomyApi";
import { TaxonomyList } from "./TaxonomyList";

export default function BlogTags() {
  return (
    <TaxonomyList
      api={blogTagsApi}
      title="Blog Tags"
      description="Tags used across blog posts."
      icon={FiTag}
      entityName="Tag"
      addLabel="Add Tag"
      fields={{}}
    />
  );
}
