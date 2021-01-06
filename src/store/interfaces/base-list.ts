export interface BaseListSort {
  sort: string;
  direction: "asc" | "desc";
}

export interface BaseListFilter {
  limit?: number;
  offset?: number;
}
