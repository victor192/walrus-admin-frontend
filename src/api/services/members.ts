import { request } from "../axios";
import { CreateMemberDTO } from "../dto/create-member.dto";

const getList = async (
  limit = 50,
  offset = 0,
  sort = "first_name",
  direction = "desc",
  club_id: number | null = null,
  gender: string | null = null,
  search: string | null = null
) => {
  return await request(
    {
      url: "/members",
      method: "GET",
      params: {
        limit,
        offset,
        sort,
        direction,
        club_id,
        gender,
        search
      }
    },
    true
  );
};

const getMember = async (id: string) => {
  return await request(
    {
      url: `/members/${id}`,
      method: "GET"
    },
    true
  );
};

const createMember = async (data: CreateMemberDTO) => {
  return await request(
    {
      url: "/members",
      method: "POST",
      data
    },
    true
  );
};

export default {
  getList,
  getMember,
  createMember
};
