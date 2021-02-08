import { BaseListFilter } from "./base-list-filter.interface";

export interface MembersFilter extends BaseListFilter {
  club_id?: number;
  gender?: string;
}
