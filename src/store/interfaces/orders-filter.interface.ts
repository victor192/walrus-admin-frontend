import { BaseListFilter } from "./base-list-filter.interface";

export interface OrdersFilter extends BaseListFilter {
  competition_id?: number;
  gender?: string;
  para_swimmer?: boolean;
  status?: string;
}
