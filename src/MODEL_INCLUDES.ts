import Workspace from "./models/workspace";

export const modelIncludes: Record<string, any> = {
  document: {
    include: [{ model: Workspace, attributes: ["id", "slug"] }],
  },
};
