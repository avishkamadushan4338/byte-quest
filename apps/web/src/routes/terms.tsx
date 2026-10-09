import { createFileRoute } from "@tanstack/react-router";

import { termsPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const TermsRoute = () => <PolicyPage meta={termsPolicy} />;

export const Route = createFileRoute("/terms")({
  head: () => ({
    links: [buildCanonicalLink("/terms")],
    meta: buildSeoMeta({
      description: termsPolicy.lede,
      path: "/terms",
      title: termsPolicy.title,
    }),
  }),
  component: TermsRoute,
});
