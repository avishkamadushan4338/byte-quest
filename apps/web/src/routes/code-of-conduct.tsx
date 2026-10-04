import { createFileRoute } from "@tanstack/react-router";

import { codeOfConductPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";

const CodeOfConductRoute = () => <PolicyPage meta={codeOfConductPolicy} />;

export const Route = createFileRoute("/code-of-conduct")({
  head: () => ({ meta: [{ title: codeOfConductPolicy.pageTitle }] }),
  component: CodeOfConductRoute,
});
