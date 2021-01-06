import { request } from "../axios";
import { CreateMemberDTO } from "../dto/members";

const getList = async (
  limit = 50,
  offset = 0,
  sort = "first_name",
  direction = "desc",
  club_id: null | number = null
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
        club_id
      }
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
  createMember
};
