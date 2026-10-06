import { relations } from "drizzle-orm";

import { team } from "../teams/team";
import { school } from "./school";

export const schoolRelations = relations(school, ({ many }) => ({
  teams: many(team),
}));
