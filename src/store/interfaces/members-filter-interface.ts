import { BaseListFilter } from "./base-list-filter.interface";

export interface MembersFilter extends BaseListFilter {
  club_id?: number;
  gender?: string;
  min_age?: number;
  max_age?: number;
}
