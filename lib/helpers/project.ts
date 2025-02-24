import { Doc, Id } from "../../convex/_generated/dataModel";
import { produce } from "immer";

type ProjectDoc = Omit<Doc<"user_project">, "_creationTime" | "_id">;

const defaultProject: ProjectDoc = {
  owner_id: "" as Id<"users">,
  name: "",
  description: "",
  is_public: false,
  collaborators: [],
  updated_at: 0,
};

export class Project {
  constructor(private project: ProjectDoc = defaultProject) {}
  set(project: Partial<ProjectDoc>) {
    this.project = produce(this.project, (draft) => {
      Object.assign(draft, project);
    });
    return this;
  }
  update(project: ProjectDoc) {
    this.project = produce(this.project, (draft) => {
      Object.assign(draft, project);
    });
    return this;
  }
  get() {
    return this.project;
  }
}
