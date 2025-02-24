import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authenticateAndGetUser } from "./auth";
import { Project } from "../lib/helpers/project";

export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    is_public: v.boolean(),
    collaborators: v.array(v.id("users")),
  },
  handler: async (ctx, args) => {
    const user = await authenticateAndGetUser(ctx);

    const project = new Project()
      .set({
        owner_id: user._id,
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
    const user = await authenticateAndGetUser(ctx);

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

    const user = await authenticateAndGetUser(ctx);

    const project = await ctx.db.get(args.id);
    if (!project) {
      throw new Error("Project not found");
    }

    if (
      project.owner_id !== user._id &&
      !project.collaborators.includes(user._id)
    ) {
      throw new Error("You are not allowed to access this project");
    }

    return project;
  },
});
export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await authenticateAndGetUser(ctx);

    return await ctx.db
      .query("user_project")
      .filter((q) => q.eq(q.field("owner_id"), user._id))
      .collect();
  },
});
