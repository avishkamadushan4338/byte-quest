import { defineRelationsPart } from "drizzle-orm";

import { school } from "./school";

export const schoolRelations = defineRelationsPart({ school }, () => ({}));
