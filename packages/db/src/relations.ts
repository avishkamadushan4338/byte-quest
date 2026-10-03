import { defineRelations } from "drizzle-orm";

import * as schema from "./schema";
import { accessRelations } from "./schema/access/relations";
import { schoolRelations } from "./schema/schools/relations";
import { submissionRelations } from "./schema/submissions/relations";
import { teamRelations } from "./schema/teams/relations";

export const relations = {
  ...defineRelations(schema),
  ...schema.authRelations,
  ...accessRelations,
  ...schoolRelations,
  ...teamRelations,
  ...submissionRelations,
};
