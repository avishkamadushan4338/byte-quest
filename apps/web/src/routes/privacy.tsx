import { createFileRoute } from "@tanstack/react-router";

import { privacyPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";

const PrivacyRoute = () => <PolicyPage meta={privacyPolicy} />;

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: privacyPolicy.pageTitle }] }),
  component: PrivacyRoute,
});
