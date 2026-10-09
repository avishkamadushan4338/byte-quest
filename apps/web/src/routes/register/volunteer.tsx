import { createFileRoute } from "@tanstack/react-router";

import { BackToSectors } from "@/components/register/back-to-sectors";
import { Volunteers } from "@/components/volunteers/volunteers";

const RegisterVolunteerRoute = () => (
  <>
    <BackToSectors />
    <Volunteers />
  </>
);

export const Route = createFileRoute("/register/volunteer")({
  component: RegisterVolunteerRoute,
});
