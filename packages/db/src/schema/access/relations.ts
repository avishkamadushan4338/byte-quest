import { defineRelationsPart } from "drizzle-orm";

import { user } from "../auth";
import { adminApplication } from "./admin-application";
import { userProfile } from "./user-profile";

export const accessRelations = defineRelationsPart(
  { user, userProfile, adminApplication },
  (r) => ({
    userProfile: {
      user: r.one.user({
        from: r.userProfile.userId,
        to: r.user.id,
      }),
    },
    adminApplication: {
      reviewedBy: r.one.userProfile({
        from: r.adminApplication.reviewedByUserId,
        to: r.userProfile.userId,
      }),
    },
  })
);
