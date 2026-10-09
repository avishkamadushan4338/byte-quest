import { createFileRoute } from "@tanstack/react-router";

import { codeOfConductPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";
import { buildCanonicalLink, buildSeoMeta } from "@/utils/seo";

const CodeOfConductRoute = () => <PolicyPage meta={codeOfConductPolicy} />;

export const Route = createFileRoute("/code-of-conduct")({
  head: () => ({
    links: [buildCanonicalLink("/code-of-conduct")],
    meta: buildSeoMeta({
      description: codeOfConductPolicy.lede,
      path: "/code-of-conduct",
      title: codeOfConductPolicy.title,
    }),
  }),
  component: CodeOfConductRoute,
});
