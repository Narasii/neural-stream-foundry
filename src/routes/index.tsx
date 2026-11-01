import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bell,
  KanbanSquare,
  List,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Table2,
  Waves,
  X,
} from "lucide-react";
import { IconRail, ProjectSidebar } from "@/components/dashboard/Sidebar";
import { Avatars, Board } from "@/components/dashboard/Board";
import { Copilot } from "@/components/dashboard/Copilot";
import { columns, initialJobs, tagClass, type ColumnId, type Job } from "@/components/dashboard/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Stream Bench — NeuroStream-X Control" },
      {
        name: "description",
        content: "Track streaming jobs, bandwidth, memory and batch latency for the NeuroStream-X pipeline.",
      },
      { property: "og:title", content: "Stream Bench — NeuroStream-X Control" },
      {
        property: "og:description",
        content: "Track streaming jobs, bandwidth, memory and batch latency for the NeuroStream-X pipeline.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "kanban" | "table" | "list";

const views: { id: View; label: string; icon: typeof List }[] = [
  { id: "kanban", label: "Kanban", icon: KanbanSquare },
  { id: "table", label: "Table", icon: Table2 },
  { id: "list", label: "List", icon: List },
];

function stageName(id: ColumnId) {
  return columns.find((c) => c.id === id)?.title ?? id;
}

function TableView({ jobs }: { jobs: Job[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-column">
      <table className="w-full text-sm">
        <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Job</th>
            <th className="px-4 py-3 font-medium">Stage</th>
            <th className="px-4 py-3 font-medium">Bandwidth</th>
            <th className="px-4 py-3 font-medium">Memory</th>
            <th className="px-4 py-3 font-medium">Latency</th>
            <th className="px-4 py-3 font-medium">Owners</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className="border-t border-border">
              <td className="px-4 py-3">
                <span className="flex items-center gap-2.5">
                  <span className={cn("size-2 rounded-full", tagClass[j.tag])} />
                  {j.title}
                </span>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{stageName(j.column)}</td>
              <td className="px-4 py-3 font-mono text-xs">{j.bandwidth != null ? `${j.bandwidth} GB/s` : "—"}</td>
              <td className="px-4 py-3 font-mono text-xs">{j.memory != null ? `${j.memory}%` : "—"}</td>
              <td className="px-4 py-3 font-mono text-xs">{j.latency != null ? `${j.latency} ms` : "—"}</td>
              <td className="px-4 py-3">
                <Avatars owners={j.owners} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ListView({ jobs }: { jobs: Job[] }) {
  return (
    <div className="space-y-6">
      {columns.map((c) => (
        <div key={c.id}>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</h2>
          <ul className="divide-y divide-border rounded-2xl bg-column">
            {jobs
              .filter((j) => j.column === c.id)
              .map((j) => (
                <li key={j.id} className="flex items-center gap-3 px-4 py-3 text-sm">
                  <span className={cn("h-1 w-5 rounded-full", tagClass[j.tag])} />
                  <span className="flex-1">{j.title}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="size-3.5" /> {j.comments}
                  </span>
                  <Avatars owners={j.owners} />
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Index() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [view, setView] = useState<View>("kanban");
  const [starred, setStarred] = useState(true);
  const [copilot, setCopilot] = useState(true);
  const [query, setQuery] = useState("");

  const visible = jobs.filter((j) => j.title.toLowerCase().includes(query.toLowerCase()));

  const move = (id: string, column: ColumnId) =>
    setJobs((js) => js.map((j) => (j.id === id ? { ...j, column } : j)));
  const add = (column: ColumnId, title: string) =>
    setJobs((js) => [
      ...js,
      { id: crypto.randomUUID(), title, column, tag: "blue", comments: 0, owners: ["NS"] },
    ]);

  return (
    <main className="min-h-screen p-6 lg:p-10">
      <div className="relative mx-auto flex h-[calc(100vh-5rem)] min-h-[720px] max-w-[1600px] gap-2 overflow-hidden rounded-3xl bg-shell p-2 shadow-2xl">
        <IconRail />
        <ProjectSidebar />

        <section className="flex min-w-0 flex-1 flex-col px-6 pt-5">
          <header className="flex items-center gap-4">
            <div className="grid size-11 place-items-center rounded-xl bg-column text-primary">
              <Waves className="size-5" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Stream Bench</h1>
            <button onClick={() => setStarred((s) => !s)} aria-label="Star pipeline">
              <Star className={cn("size-4", starred ? "fill-tag-yellow text-tag-yellow" : "text-muted-foreground")} />
            </button>
            <div className="ml-auto flex items-center gap-4">
              <div className="flex items-center">
                <span className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Plus className="size-4" />
                </span>
                <div className="-ml-1">
                  <Avatars owners={["NS", "AK", "RV"]} />
                </div>
              </div>
              <Bell className="size-4 text-muted-foreground" />
              <label className="flex items-center gap-2 rounded-lg bg-column px-2.5 py-1.5 text-sm">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Filter jobs"
                  className="w-28 bg-transparent outline-none placeholder:text-muted-foreground"
                />
              </label>
              <MoreVertical className="size-4 text-muted-foreground" />
            </div>
          </header>

          <nav className="mt-6 flex items-center gap-1 border-b border-border">
            {views.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={cn(
                  "-mb-px flex items-center gap-2 border-b-2 px-3 pb-3 text-sm transition-colors",
                  view === id
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
            <span className="ml-auto flex items-center gap-2 pb-3 text-sm text-muted-foreground">
              <SlidersHorizontal className="size-4" /> Filter
            </span>
          </nav>

          <div className="min-h-0 flex-1 overflow-auto py-5 pr-2">
            {view === "kanban" && <Board jobs={visible} onMove={move} onAdd={add} />}
            {view === "table" && <TableView jobs={visible} />}
            {view === "list" && <ListView jobs={visible} />}
          </div>
        </section>

        <div className="absolute bottom-5 right-5 flex flex-col items-end gap-3">
          {copilot && <Copilot onClose={() => setCopilot(false)} />}
          <button
            onClick={() => setCopilot((c) => !c)}
            aria-label={copilot ? "Hide assistant" : "Show assistant"}
            className="grid size-11 place-items-center rounded-full bg-popover text-foreground shadow-lg ring-1 ring-border hover:bg-accent"
          >
            {copilot ? <X className="size-4" /> : <Waves className="size-4 text-primary" />}
          </button>
        </div>
      </div>
    </main>
  );
}
