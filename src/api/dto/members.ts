export interface CreateMemberDTO {
  first_name: string;
  last_name: string;
  middle_name?: string;
  birthdate: Date;
  gender: string;
  club_id: number;
  phone?: string;
  email?: string;
}
