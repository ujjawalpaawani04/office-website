import { FiEdit3 } from "react-icons/fi";
import { blogAuthorsApi } from "../../api/blogTaxonomyApi";
import { TaxonomyList } from "./TaxonomyList";

export default function BlogAuthors() {
  return (
    <TaxonomyList
      api={blogAuthorsApi}
      title="Blog Authors"
      description="Bylines credited on blog posts."
      icon={FiEdit3}
      entityName="Author"
      addLabel="Add Author"
      fields={{ avatar: true, designation: true, bio: true }}
      extraColumns={[{ key: "designation", label: "Designation" }]}
    />
  );
}
