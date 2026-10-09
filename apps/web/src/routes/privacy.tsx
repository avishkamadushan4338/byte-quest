import { createFileRoute } from "@tanstack/react-router";

import { privacyPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const PrivacyRoute = () => <PolicyPage meta={privacyPolicy} />;

export const Route = createFileRoute("/privacy")({
  head: () => ({
    links: [buildCanonicalLink("/privacy")],
    meta: buildSeoMeta({
      description: privacyPolicy.lede,
      path: "/privacy",
      title: privacyPolicy.title,
    }),
  }),
  component: PrivacyRoute,
});
