import { createFileRoute } from "@tanstack/react-router";

import { submissionGuidelinesPolicy } from "@/components/legal/policies";
import { PolicyPage } from "@/components/legal/policy-page";

const SubmissionGuidelinesRoute = () => (
  <PolicyPage meta={submissionGuidelinesPolicy} />
);

export const Route = createFileRoute("/submission-guidelines")({
  component: SubmissionGuidelinesRoute,
});
