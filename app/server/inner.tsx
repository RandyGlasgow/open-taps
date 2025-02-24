"use client";

import { Preloaded } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home(_: {
  preloaded: Preloaded<typeof api.project.getProjects>;
}) {
  return (
    <>
      <div className="flex flex-col gap-4 bg-slate-200 dark:bg-slate-800 p-4 rounded-md">
        <h2 className="text-xl font-bold">Reactive client-loaded data</h2>
        <code></code>
      </div>
    </>
  );
}
