import { createMapper, Module } from "vuex-smart-module";
import { Orders } from "@/api";
import { OrderData } from "../interfaces/order-data.interface";
import { OrdersFilter } from "../interfaces/orders-filter.interface";
import {
  BaseListActions,
  BaseListGetters,
  BaseListMutations,
  BaseListState
} from "./base-list";

class OrdersState extends BaseListState<OrderData> {
  sort = "created_at";
  direction = "desc";
}

class OrdersGetters extends BaseListGetters<OrderData> {}

class OrdersMutations extends BaseListMutations<OrderData> {}

class OrdersActions extends BaseListActions<OrderData> {
  async setOrders(payload: OrdersFilter): Promise<boolean> {
    const limit = payload.limit || this.state.limit;
    const offset = payload.offset || this.state.offset;
    const competition_id = payload.competition_id || null;
    const gender = payload.gender || null;
    const para_swimmer = payload.para_swimmer || null;
    const status = payload.status || null;
    const search = payload.search || null;
    const { sort, direction } = this.state;

    try {
      const { status: ordersStatus, data } = await Orders.getList(
        limit,
        offset,
        sort,
        direction,
        competition_id,
        gender,
        para_swimmer,
        status,
        search
      );

      if (ordersStatus === 200) {
        const { data: orders, total, limit, offset } = data;

        this.commit("SET_ITEMS", orders);
        this.commit("SET_CONTEXT", { total, limit, offset });

        return Promise.resolve(true);
      }

      return Promise.reject(false);
    } catch (error) {
      console.log(error);

      return Promise.reject(false);
    }
  }
}

export const orders = new Module({
  state: OrdersState,
  getters: OrdersGetters,
  mutations: OrdersMutations,
  actions: OrdersActions
});

export const ordersMapper = createMapper(orders);
