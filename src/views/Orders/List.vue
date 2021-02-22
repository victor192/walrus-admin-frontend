<template>
  <v-card class="d-flex flex-column" :loading="isLoading">
    <v-data-table
      :headers="ordersHeaders"
      :items="ordersList"
      :options.sync="ordersOptions"
      :server-items-length="ordersTotal"
      :items-per-page="ordersLimit"
    >
      <template #item.last_name="{ item }">
        <router-link :to="orderLink(item.id)">{{
          getFullName(item.last_name, item.first_name, item.middle_name)
        }}</router-link>
        <v-chip
          v-if="item.para_swimmer"
          class="ma-2"
          color="cyan"
          label
          small
          text-color="white"
          >Парапловец</v-chip
        >
      </template>
      <template #item.gender="{ item }">
        {{ getGenderName(item.gender) }}
      </template>
      <template #item.birthdate="{ item }">
        {{ getAgeFromBirthdate(item.birthdate) }}
      </template>
      <template #item.created_at="{ item }">
        {{ formattedDateTime(item.created_at) }}
      </template>
      <template #item.status="{ item }">
        <order-status :status="item.status" />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { ordersMapper } from "@/store/modules/orders";
import {
  getFullName,
  getGenderName,
  getAgeFromBirthdate
} from "@/utils/filters";
import { formattedDateTime } from "@/utils/time";
import OrderStatus from "./Common/Status.vue";

export default Vue.extend({
  name: "OrdersList",
  components: {
    OrderStatus
  },
  data() {
    return {
      currentPage: 1,
      isLoading: true,
      isFetchError: false,
      ordersOptions: {},
      ordersHeaders: [
        {
          text: "ФИО",
          sortable: true,
          value: "last_name",
          width: 300
        },
        {
          text: "Пол",
          sortable: true,
          value: "gender",
          width: 100
        },
        {
          text: "Возраст",
          sortable: true,
          value: "birthdate",
          align: "right",
          width: 150
        },
        {
          text: "Соревнование",
          sortable: false,
          value: "competition_name",
          width: 150
        },
        {
          text: "Дистанций",
          sortable: true,
          value: "races_count",
          align: "right",
          width: 120
        },
        {
          text: "Эстафет",
          sortable: true,
          value: "relays_count",
          align: "right",
          width: 100
        },
        {
          text: "Криатлон",
          sortable: true,
          value: "cryatlons_count",
          align: "right",
          width: 120
        },
        {
          text: "Дата создания",
          sortable: true,
          value: "created_at",
          width: 200
        },
        {
          text: "Статус",
          sortable: true,
          value: "status",
          align: "center"
        }
      ]
    };
  },
  watch: {
    ordersOptions: {
      handler(val) {
        const { page, itemsPerPage: limit, sortBy, sortDesc } = val;
        const offset = (page - 1) * limit;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          const sort = sortBy[0];
          const direction = sortDesc[0] ? "desc" : "asc";

          this.setSort({ sort, direction });
        }

        this.fetchOrdersList(limit, offset);
      },
      deep: true
    }
  },
  computed: {
    ...ordersMapper.mapGetters({
      isMembers: "isListNotEmpty"
    }),
    ...ordersMapper.mapState({
      ordersList: state => state.list,
      ordersLimit: state => state.limit,
      ordersOffset: state => state.offset,
      ordersTotal: state => state.total,
      ordersSort: state => state.sort,
      ordersDirection: state => state.direction
    })
  },
  methods: {
    ...ordersMapper.mapActions(["setOrders", "setSort"]),
    getFullName,
    getGenderName,
    getAgeFromBirthdate,
    formattedDateTime,
    async fetchOrdersList(
      this: any,
      limit: number = this.membersLimit,
      offset: number = this.membersOffset,
      search: string | null = null
    ) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        await this.setOrders({
          limit,
          offset,
          search
        });

        this.isLoading = false;
      } catch (error) {
        this.isFetchError = true;
      }
    },
    orderLink(id: number) {
      return { name: "orders-order", params: { id } };
    }
  }
});
</script>
