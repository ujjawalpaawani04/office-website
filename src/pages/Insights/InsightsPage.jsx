import { Seo } from "../../components/common/Seo";
import { InsightsHero } from "./components/InsightsHero";
import { LatestArticles } from "./components/LatestArticles";
import { WhyReadInsights } from "./components/WhyReadInsights";
import { Newsletter } from "./components/Newsletter";
import { InsightsFAQ } from "./components/InsightsFAQ";
import { InsightsCTA } from "./components/InsightsCTA";

const InsightsPage = () => {
  return (
    <div className="bg-white">
      <Seo
        title="Insights & Articles"
        description="Expert insights on taxation, GST, audit, compliance, and business advisory from the Chartered Accountants at Singh Amit & Associates."
        canonicalPath="/insights"
      />
      <InsightsHero />
      <LatestArticles />
      <WhyReadInsights />
      <Newsletter />
      <InsightsFAQ />
      <InsightsCTA />
    </div>
  );
};

export default InsightsPage;
