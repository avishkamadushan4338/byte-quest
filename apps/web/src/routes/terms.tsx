import { createFileRoute } from "@tanstack/react-router";

import { termsPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";

const TermsRoute = () => <PolicyPage meta={termsPolicy} />;

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: termsPolicy.pageTitle }] }),
  component: TermsRoute,
});
