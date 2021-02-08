import { Actions, Getters, Mutations } from "vuex-smart-module";
import { BaseListSort } from "../interfaces/base-list-sort.interface";

export class BaseListState<T> {
  list: T[] = [];
  total = 0;
  limit = 50;
  offset = 0;
  sort = "name";
  direction = "desc";
}

export class BaseListGetters<T> extends Getters<BaseListState<T>> {
  get isListNotEmpty() {
    return this.state.list.length > 0;
  }
}

export class BaseListMutations<T> extends Mutations<BaseListState<T>> {
  SET_ITEMS(items: T[]) {
    this.state.list = items;
  }

  SET_SORT(data: any) {
    this.state.sort = data.sort || this.state.sort;
    this.state.direction = data.direction || this.state.direction;
  }

  SET_CONTEXT(context: any) {
    this.state.total = context.total || this.state.total;
    this.state.limit = context.limit || this.state.limit;
    this.state.offset = context.offset || this.state.offset;
  }
}

export class BaseListActions<T> extends Actions<
  BaseListState<T>,
  BaseListGetters<T>,
  BaseListMutations<T>
> {
  setSort(payload: BaseListSort) {
    this.commit("SET_SORT", payload);
  }
}
