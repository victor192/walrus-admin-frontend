import { BaseListFilter } from "@/store/interfaces/base-list";

export interface MemberData {
  id: number;
  first_name: string;
  last_name: string;
  middle_name: string;
}

export interface MembersFilter extends BaseListFilter {
  club_id?: number;
  gender?: string;
}
