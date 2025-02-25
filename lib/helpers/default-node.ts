export const DEFAULT_NODE = {
  id: "0",
  type: "root_node",
  data: {},
  position: { x: 0, y: 50 },
};

export const defaultNode = (data: Record<string, unknown> = {}) => {
  return {
    ...DEFAULT_NODE,
    data,
  };
};
