export interface ClubData {
  id: number;
  name: string;
  location: string
}

export interface ClubsListFilter {
  limit?: number;
  offset?: number;
}

export interface ClubsListSort {
  sort: string;
  direction: "asc" | "desc";
}
