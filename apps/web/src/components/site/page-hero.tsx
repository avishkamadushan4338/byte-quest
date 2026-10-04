import { PageHero as PageHeroPrimitive } from "@byte-quest/ui/components/page-hero";
import { Link } from "@tanstack/react-router";

export const PageHero = (
  props: Omit<Parameters<typeof PageHeroPrimitive>[0], "linkComponent">
) => <PageHeroPrimitive {...props} linkComponent={Link} />;
