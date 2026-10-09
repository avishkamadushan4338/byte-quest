import { createFileRoute } from "@tanstack/react-router";

import { submissionGuidelinesPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const SubmissionGuidelinesRoute = () => (
  <PolicyPage meta={submissionGuidelinesPolicy} />
);

export const Route = createFileRoute("/submission-guidelines")({
  head: () => ({
    links: [buildCanonicalLink("/submission-guidelines")],
    meta: buildSeoMeta({
      description: submissionGuidelinesPolicy.lede,
      path: "/submission-guidelines",
      title: submissionGuidelinesPolicy.title,
    }),
  }),
  component: SubmissionGuidelinesRoute,
});
