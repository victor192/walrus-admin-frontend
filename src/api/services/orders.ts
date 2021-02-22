import { request } from "../axios";

const getList = async (
  limit = 50,
  offset = 0,
  sort = "created_at",
  direction = "desc",
  competition_id: number | null = null,
  gender: string | null = null,
  para_swimmer: boolean | null = null,
  status: string | null = null,
  search: string | null = null
) => {
  return await request(
    {
      url: "/orders",
      method: "GET",
      params: {
        limit,
        offset,
        sort,
        direction,
        competition_id,
        gender,
        para_swimmer,
        status,
        search
      }
    },
    true
  );
};

const getOrder = async (id: string) => {
  return await request(
    {
      url: `/orders/${id}`,
      method: "GET"
    },
    true
  );
};

export default {
  getList,
  getOrder
};
