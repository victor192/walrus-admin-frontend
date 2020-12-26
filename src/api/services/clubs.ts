import { request } from "../axios";

const getList = async (limit = 50, offset = 0) => {
  return await request(
    {
      url: "/clubs",
      method: "GET",
      params: {
        limit,
        offset
      }
    },
    true
  );
};

export default {
  getList
};
