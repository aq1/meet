import { relations } from "drizzle-orm";
import { account } from "./account";
import { session } from "./session";
import { user } from "./user";
export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
}));
