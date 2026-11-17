export interface ICTaskPayload {
  title: string;
  description?: string;
  status?: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE" | "BLOCKED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
}
