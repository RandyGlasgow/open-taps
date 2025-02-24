"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="text-2xl font-bold">Brew Logs</h1>
      <ProjectTable />
    </>
  );
}

const ProjectTable = () => {
  const projects = useQuery(api.brew_journal.getBrewJournals) || "loading";

  if (projects === "loading") {
    return <Skeleton className="w-full h-full" />;
  }
  return (
    <Table>
      <TableBody>
        {projects.map((project) => (
          <TableRow key={project._id}>
            <TableCell className="group flex flex-col gap-2">
              <Link href={`/dashboard/projects/${project._id}`}>
                <div className="font-bold group-hover:underline flex items-center gap-2 justify-between">
                  <span>{project.name}</span>
                </div>
                {project.description && (
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </div>
                )}
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
