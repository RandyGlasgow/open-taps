import { Id } from "../convex/_generated/dataModel";

export const GRAPH_TYPES = {
  RECIPE_TREE: "recipe_tree",
  RECIPE: "recipe",
} as const;
export type GraphType = (typeof GRAPH_TYPES)[keyof typeof GRAPH_TYPES];

export const NODE_TYPES = {
  ROOT_RECIPE_TREE_NODE: "root_recipe_node",
  RECIPE_NODE: "recipe_node",
} as const;
export type NodeType = (typeof NODE_TYPES)[keyof typeof NODE_TYPES];

type RootRecipeTreeNode = {
  id: Id<"node">;
  type: NodeType;
  position: { x: number; y: number };
  data: { node_id: Id<"node"> };
};

export const createRootRecipeTreeNode = (
  id: Id<"node">,
  args: Partial<RootRecipeTreeNode & { type: NodeType }>,
): RootRecipeTreeNode => {
  return {
    ...args,
    id,
    type: args.type ?? NODE_TYPES.ROOT_RECIPE_TREE_NODE,
    position: { x: 0, y: 0 },
    data: { node_id: id },
  };
};

export const createRecipeGraph = (id: Id<"node">) => {
  if (id === undefined) {
    return JSON.stringify({
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
    });
  }
  return JSON.stringify({
    nodes: [createRootRecipeTreeNode(id, { position: { x: 0, y: 0 } })],
    edges: [],
    viewport: { x: 0, y: 0, zoom: 1 },
  });
};
