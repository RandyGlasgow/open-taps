export const checkForPipeAndSplit = (path: string = "") => {
  if (path.includes("|")) {
    const [name, id] = path.split("|");
    return { name, id };
  }
  return { name: path, id: null };
};
