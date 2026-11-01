export type Tag = "green" | "red" | "yellow" | "blue" | "violet";
export type ColumnId = "queued" | "streaming" | "completed";

export interface Job {
  id: string;
  title: string;
  description?: string;
  tag: Tag;
  column: ColumnId;
  comments: number;
  attachments?: number;
  owners: string[];
  /** Optional telemetry preview: bandwidth samples in GB/s */
  spark?: number[];
  bandwidth?: number;
  memory?: number;
  latency?: number;
}

export const columns: { id: ColumnId; title: string }[] = [
  { id: "queued", title: "Queued" },
  { id: "streaming", title: "Streaming" },
  { id: "completed", title: "Completed" },
];

export const tagClass: Record<Tag, string> = {
  green: "bg-tag-green",
  red: "bg-tag-red",
  yellow: "bg-tag-yellow",
  blue: "bg-tag-blue",
  violet: "bg-tag-violet",
};

export const initialJobs: Job[] = [
  { id: "j1", title: "Shard ImageNet-22k to mmap", tag: "green", column: "queued", comments: 3, owners: ["NS", "AK"] },
  {
    id: "j2",
    title: "Prefetch window sweep",
    tag: "red",
    column: "queued",
    comments: 1,
    attachments: 1,
    owners: ["NS"],
    spark: [4, 6, 5, 8, 7, 9, 11, 10, 12, 11, 13, 12],
  },
  { id: "j3", title: "NUMA pinning on node-02", tag: "blue", column: "queued", comments: 2, owners: ["RV", "NS", "AK"] },
  {
    id: "j4",
    title: "Page-fault profiling report",
    description: "Trace major/minor faults across 8 workers and compare against the O_DIRECT baseline.",
    tag: "violet",
    column: "queued",
    comments: 3,
    attachments: 2,
    owners: ["AK", "NS"],
  },
  { id: "j5", title: "Validate tokenizer shards", tag: "yellow", column: "queued", comments: 4, owners: ["RV"] },

  { id: "j6", title: "LAION-400M ingest", tag: "red", column: "streaming", comments: 1, owners: ["NS", "AK"], bandwidth: 11.8, memory: 62, latency: 0.42 },
  {
    id: "j7",
    title: "Ring-buffer backpressure test",
    description: "Hold producer at 2× consumer rate and confirm the buffer never copies on the hot path.",
    tag: "green",
    column: "streaming",
    comments: 2,
    owners: ["RV"],
    bandwidth: 7.3,
    memory: 41,
    latency: 0.88,
  },
  { id: "j8", title: "Huge-page TLB benchmark", tag: "yellow", column: "streaming", comments: 5, owners: ["NS", "AK", "RV"], bandwidth: 9.1, memory: 55, latency: 0.51 },

  { id: "j9", title: "Baseline: PyTorch DataLoader", tag: "green", column: "completed", comments: 7, owners: ["NS", "AK", "RV"] },
  { id: "j10", title: "Mmap index builder v2", tag: "yellow", column: "completed", comments: 2, attachments: 1, owners: ["AK", "NS"] },
  { id: "j11", title: "Zero-copy collate kernel", tag: "red", column: "completed", comments: 2, owners: ["NS", "RV"] },
  { id: "j12", title: "Telemetry exporter", tag: "blue", column: "completed", comments: 1, owners: ["AK"] },
  {
    id: "j13",
    title: "Throughput regression audit",
    description: "Bisect the 6% drop introduced after switching madvise hints to MADV_SEQUENTIAL.",
    tag: "violet",
    column: "completed",
    comments: 4,
    owners: ["NS"],
  },
  {
    id: "j14",
    title: "Weekly bandwidth snapshot",
    tag: "red",
    column: "completed",
    comments: 1,
    attachments: 1,
    owners: ["RV"],
    spark: [9, 10, 9, 11, 12, 12, 13, 12, 14, 13, 15, 14],
  },
];

export const favorites = [
  { label: "Bandwidth Monitor", icon: "gauge" },
  { label: "Memory Map", icon: "cpu" },
  { label: "Latency Traces", icon: "activity" },
] as const;

export const pipelines = [
  { label: "Vision Pretrain", count: 6 },
  { label: "LLM Tokenizer", count: 4 },
  { label: "Stream Bench", count: 14, active: true },
  { label: "Audio Shards", count: 3 },
  { label: "Multi-GPU Sync", count: 9 },
  { label: "CUDA Prefetch", count: 2 },
];

export const categories = [
  { label: "Ingestion", tag: "red" as Tag },
  { label: "Benchmarks", tag: "green" as Tag },
  { label: "Profiling", tag: "blue" as Tag },
];

const replies: { match: RegExp; text: string }[] = [
  {
    match: /latenc|slow|p99/i,
    text: "p99 batch latency on Stream Bench is 0.88 ms, driven by the backpressure test. Three things usually help:\n\n1. Widen the prefetch window to 4 batches so workers stay ahead of the GPU.\n2. Pin readers to the NUMA node that owns the shard file.\n3. Enable huge pages to cut TLB misses on large mmaps.",
  },
  {
    match: /memory|ram|rss/i,
    text: "Resident memory is at 55% of the budget across the three running jobs. Most of it is page cache from mmapped shards, which the kernel can reclaim. No job is copying batches on the hot path.",
  },
  {
    match: /bandwidth|throughput|gb/i,
    text: "Combined read bandwidth is 28.2 GB/s right now. LAION-400M ingest is the heaviest at 11.8 GB/s. There is headroom of roughly 6 GB/s before the NVMe array saturates.",
  },
];

export function copilotReply(question: string): string {
  const hit = replies.find((r) => r.match.test(question));
  return (
    hit?.text ??
    "I can summarise bandwidth, memory or latency for any running job. Try asking “why is latency high?” or “how much memory are we using?”"
  );
}
