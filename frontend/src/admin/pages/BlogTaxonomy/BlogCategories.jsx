import { FiFolder } from "react-icons/fi";
import { blogCategoriesApi } from "../../api/blogTaxonomyApi";
import { TaxonomyList } from "./TaxonomyList";

export default function BlogCategories() {
  return (
    <TaxonomyList
      api={blogCategoriesApi}
      title="Blog Categories"
      description="Taxonomy used to organize blog posts."
      icon={FiFolder}
      entityName="Category"
      addLabel="Add Category"
      fields={{ description: true }}
      extraColumns={[{ key: "description", label: "Description", className: "max-w-xs truncate" }]}
    />
  );
}
