import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authenticateAndGetUser } from "./auth";
import { Project } from "../lib/helpers/project";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    is_public: v.boolean(),
    collaborators: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const project = new Project()
      .set({
        owner_id: userId,
        updated_at: Date.now(),
        name: args.name,
        description: args.description,
        is_public: args.is_public,
        collaborators: args.collaborators,
      })
      .get();
    await ctx.db.insert("user_project", project);
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("user_project"),
    name: v.string(),
    description: v.string(),
    is_public: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    const updatedProject = new Project(project)
      .set({
        name: args.name,
        description: args.description,
        updated_at: Date.now(),
        is_public: args.is_public,
      })
      .get();

    await ctx.db.patch(args.id, updatedProject);
    return updatedProject;
  },
});

export const getProject = query({
  args: { id: v.id("user_project") },
  handler: async (ctx, args) => {
    if (!args.id) {
      throw new Error("Project ID is required");
    }

    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (
      project.owner_id !== userId &&
      !project.collaborators.includes(userId)
    ) {
      throw new Error("You are not allowed to access this project");
    }

    return project;
  },
});
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    return await ctx.db
      .query("user_project")
      .filter((q) => q.eq(q.field("owner_id"), userId))
      .collect();
  },
});
