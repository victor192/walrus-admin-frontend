export interface CreateMemberDTO {
  first_name: string;
  last_name: string;
  middle_name?: string;
  birthdate: Date;
  gender: string;
  para_swimmer: boolean;
  club_id: number;
  phone?: string;
  email?: string;
  location?: string;
}
