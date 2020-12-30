import { request } from "../axios";

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

export default {
  getList
};
