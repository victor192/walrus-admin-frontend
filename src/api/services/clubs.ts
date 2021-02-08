import { request } from "../axios";
import { CreateClubDTO } from "../dto/create-club.dto";

const getList = async (
  limit = 50,
  offset = 0,
  sort = "name",
  direction = "desc"
) => {
  return await request(
    {
      url: "/clubs",
      method: "GET",
      params: {
        limit,
        offset,
        sort,
        direction
      }
    },
    true
  );
};

const getClub = async (id: string) => {
  return await request(
    {
      url: `/clubs/${id}`,
      method: "GET"
    },
    true
  );
};

const createClub = async (data: CreateClubDTO) => {
  return await request(
    {
      url: "/clubs",
      method: "POST",
      data
    },
    true
  );
};

export default {
  getList,
  getClub,
  createClub
};
