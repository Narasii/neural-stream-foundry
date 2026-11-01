import { useState } from "react";
import { MessageSquare, Paperclip, Plus } from "lucide-react";
import { columns, tagClass, type ColumnId, type Job } from "./data";
import { cn } from "@/lib/utils";

export function Avatars({ owners }: { owners: string[] }) {
  return (
    <div className="flex -space-x-1.5">
      {owners.map((o) => (
        <span
          key={o}
          className="grid size-6 place-items-center rounded-full border-2 border-card bg-secondary text-[9px] font-semibold text-secondary-foreground"
        >
          {o}
        </span>
      ))}
    </div>
  );
}

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * 100},${40 - ((v - min) / (max - min || 1)) * 34 - 3}`)
    .join(" ");
  return (
    <div className="rounded-lg bg-column p-3">
      <div className="flex items-baseline justify-between text-[11px] text-muted-foreground">
        <span>Read bandwidth</span>
        <span className="font-mono text-foreground">{data[data.length - 1]} GB/s</span>
      </div>
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="mt-2 h-16 w-full">
        <polyline points={`0,40 ${pts} 100,40`} className="fill-primary/20 stroke-none" />
        <polyline points={pts} className="fill-none stroke-primary" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}

function Metrics({ job }: { job: Job }) {
  if (job.bandwidth == null) return null;
  return (
    <div className="mt-3 grid grid-cols-3 gap-1.5 font-mono text-[10px]">
      <span className="rounded-md bg-column px-1.5 py-1 text-muted-foreground">
        <b className="font-medium text-foreground">{job.bandwidth}</b> GB/s
      </span>
      <span className="rounded-md bg-column px-1.5 py-1 text-muted-foreground">
        <b className="font-medium text-foreground">{job.memory}%</b> mem
      </span>
      <span className="rounded-md bg-column px-1.5 py-1 text-muted-foreground">
        <b className="font-medium text-foreground">{job.latency}</b> ms
      </span>
    </div>
  );
}

function JobCard({ job, onDragStart }: { job: Job; onDragStart: (id: string) => void }) {
  return (
    <article
      draggable
      onDragStart={() => onDragStart(job.id)}
      className="cursor-grab rounded-xl bg-card p-3 shadow-sm ring-1 ring-border transition hover:ring-primary/40 active:cursor-grabbing"
    >
      <span className={cn("block h-1 w-6 rounded-full", tagClass[job.tag])} />
      {job.spark && <div className="mt-3"><Sparkline data={job.spark} /></div>}
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <h3 className="text-sm font-medium leading-snug">{job.title}</h3>
        {!job.description && !job.spark && <Avatars owners={job.owners} />}
      </div>
      {job.description && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{job.description}</p>
      )}
      <Metrics job={job} />
      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          {job.attachments ? (
            <span className="flex items-center gap-1">
              <Paperclip className="size-3.5" />
            </span>
          ) : null}
          <span className="flex items-center gap-1">
            <MessageSquare className="size-3.5" /> {job.comments}
          </span>
        </div>
        {(job.description || job.spark) && <Avatars owners={job.owners} />}
      </div>
    </article>
  );
}

export function Board({
  jobs,
  onMove,
  onAdd,
}: {
  jobs: Job[];
  onMove: (id: string, col: ColumnId) => void;
  onAdd: (col: ColumnId, title: string) => void;
}) {
  const [dragId, setDragId] = useState<string | null>(null);
  const [over, setOver] = useState<ColumnId | null>(null);
  const [adding, setAdding] = useState<ColumnId | null>(null);
  const [draft, setDraft] = useState("");

  const submit = (col: ColumnId) => {
    if (draft.trim()) onAdd(col, draft.trim());
    setDraft("");
    setAdding(null);
  };

  return (
    <div className="flex items-start gap-4">
      {columns.map((col) => {
        const items = jobs.filter((j) => j.column === col.id);
        return (
          <section
            key={col.id}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(col.id);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={() => {
              if (dragId) onMove(dragId, col.id);
              setDragId(null);
              setOver(null);
            }}
            className={cn(
              "w-[290px] shrink-0 rounded-2xl bg-column p-3 transition",
              over === col.id && "ring-2 ring-primary/50",
            )}
          >
            <header className="flex items-center justify-between px-1 pb-3 pt-1">
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <span className="font-mono text-xs text-muted-foreground">{items.length}</span>
            </header>
            <div className="space-y-2.5">
              {items.map((j) => (
                <JobCard key={j.id} job={j} onDragStart={setDragId} />
              ))}
            </div>
            {adding === col.id ? (
              <form
                className="mt-2.5"
                onSubmit={(e) => {
                  e.preventDefault();
                  submit(col.id);
                }}
              >
                <input
                  autoFocus
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onBlur={() => submit(col.id)}
                  placeholder="Job name…"
                  className="w-full rounded-xl bg-card px-3 py-2.5 text-sm outline-none ring-1 ring-primary/50 placeholder:text-muted-foreground"
                />
              </form>
            ) : (
              <button
                onClick={() => setAdding(col.id)}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-sm text-muted-foreground hover:bg-card hover:text-foreground"
              >
                <Plus className="size-4" /> Add job
              </button>
            )}
          </section>
        );
      })}
      <button className="flex w-[260px] shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground">
        <Plus className="size-4" /> Add another stage
      </button>
    </div>
  );
}
