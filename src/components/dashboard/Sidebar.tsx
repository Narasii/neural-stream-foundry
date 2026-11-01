import { useState } from "react";
import {
  Activity,
  Archive,
  ChevronDown,
  ChevronRight,
  Cpu,
  Gauge,
  Hash,
  HelpCircle,
  Home,
  KanbanSquare,
  Search,
  Settings,
  Waves,
  X,
  Zap,
  Layers,
} from "lucide-react";
import { categories, favorites, pipelines, tagClass } from "./data";
import { cn } from "@/lib/utils";

const favIcon = { gauge: Gauge, cpu: Cpu, activity: Activity } as const;

export function IconRail() {
  const items = [
    { label: "Home", icon: Home },
    { label: "Streams", icon: Zap },
    { label: "Jobs", icon: KanbanSquare, active: true },
  ];
  return (
    <nav className="flex w-[72px] shrink-0 flex-col items-center gap-2 py-4">
      <div className="mb-4 grid size-9 place-items-center rounded-xl bg-primary/15 text-primary">
        <Waves className="size-5" />
      </div>
      {items.map(({ label, icon: Icon, active }) => (
        <button
          key={label}
          className={cn(
            "flex w-14 flex-col items-center gap-1 rounded-xl py-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground",
            active && "bg-accent text-foreground",
          )}
        >
          <Icon className="size-[18px]" />
          {label}
        </button>
      ))}
      <div className="mt-auto flex flex-col items-center gap-4 text-muted-foreground">
        <HelpCircle className="size-[18px]" />
        <Settings className="size-[18px]" />
      </div>
    </nav>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mt-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        {title}
      </button>
      {open && <ul className="mt-2 space-y-0.5">{children}</ul>}
    </div>
  );
}

export function ProjectSidebar() {
  const [promo, setPromo] = useState(true);
  return (
    <aside className="flex w-[260px] shrink-0 flex-col rounded-2xl bg-sidebar p-3">
      <label className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-foreground">
        <Search className="size-4" />
        <input
          placeholder="Search…"
          className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
        />
      </label>

      <Section title="Favorites">
        {favorites.map((f) => {
          const Icon = favIcon[f.icon];
          return (
            <li key={f.label}>
              <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
                <Icon className="size-4 text-tag-yellow" />
                {f.label}
              </button>
            </li>
          );
        })}
      </Section>

      <Section title="All pipelines">
        {pipelines.map((p) => (
          <li key={p.label}>
            <button
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent",
                p.active && "bg-sidebar-accent text-sidebar-accent-foreground",
              )}
            >
              <Layers className="size-4 text-muted-foreground" />
              <span className="flex-1 text-left">{p.label}</span>
              <span className="font-mono text-xs text-muted-foreground">{p.count}</span>
            </button>
          </li>
        ))}
      </Section>

      <Section title="Categories">
        {categories.map((c) => (
          <li key={c.label}>
            <button className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent">
              <Hash className={cn("size-4 rounded-sm p-[1px] text-shell", tagClass[c.tag])} />
              {c.label}
            </button>
          </li>
        ))}
      </Section>

      <div className="mt-5 flex items-center gap-2 px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Archive className="size-3" /> Archive
      </div>

      {promo && (
        <div className="relative mt-auto rounded-xl bg-column p-4">
          <button
            onClick={() => setPromo(false)}
            aria-label="Dismiss"
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          <p className="pr-6 text-sm font-semibold">Unlock GPU Telemetry</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            CUDA and ROCm counters, per-device bandwidth and sync traces.
          </p>
          <button className="mt-3 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
            Join the early access
          </button>
        </div>
      )}
    </aside>
  );
}
