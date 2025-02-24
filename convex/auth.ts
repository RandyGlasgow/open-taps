import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import { QueryCtx } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});

export const authenticateAndGetUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Unauthenticated call to mutation");
  }
  const [, token, _] = identity.tokenIdentifier.split("|");
  const userId = token as Id<"users">;

  const user = await ctx.db
    .query("users")
    .withIndex("by_id", (q) => q.eq("_id", userId))
    .unique();

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
