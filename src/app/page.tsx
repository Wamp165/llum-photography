import { getProjects } from "@/data/projects";

export default async function Home() {
  const projects = await getProjects();

  return (
    <pre>
      {JSON.stringify(projects, null, 2)}
    </pre>
  );
}