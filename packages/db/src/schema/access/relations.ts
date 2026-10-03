import { defineRelationsPart } from "drizzle-orm";

import { user } from "../auth";
import { userProfile } from "./user-profile";

export const accessRelations = defineRelationsPart(
  { user, userProfile },
  (r) => ({
    userProfile: {
      user: r.one.user({
        from: r.userProfile.userId,
        to: r.user.id,
      }),
    },
  })
);
