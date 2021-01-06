<template>
  <v-card class="d-flex flex-column" :loading="isLoading">
    <v-data-table
      :headers="membersHeaders"
      :items="membersList"
      :options.sync="membersOptions"
      :server-items-length="membersTotal"
      :items-per-page="membersLimit"
    >
      <template #top>
        <div class="d-flex">
          <v-select
            :items="clubs"
            label="Клуб"
            item-text="name"
            item-value="id"
            solo
          >
            <template #item="{ item }">
              <div class="d-flex flex-column text-left my-2">
                <span class="font-weight-bold">{{ item.name }}</span>
                <span>{{ item.location }}</span>
              </div>
            </template>
          </v-select>
        </div>
      </template>
      <template #item.last_name="{ item }">
        <router-link :to="memberLink(item.id)">
          {{ getFullName(item.last_name, item.first_name, item.middle_name) }}
        </router-link>
      </template>
      <template #item.club_name="{ item }">
        <router-link :to="clubLink(item.club_id)">
          {{ item.club_name }}
        </router-link>
      </template>
      <template #item.gender="{ item }">
        {{ getGenderName(item.gender) }}
      </template>
      <template #item.birthdate="{ item }">
        {{ getAgeFromBirthdate(item.birthdate) }}
      </template>
    </v-data-table>
    <create-member :clubs="clubs" />
    <v-snackbar v-model="isCreatedNewMember" color="green">
      Новый участник добавлен в клуб {{ lastCreatedMember.clubName }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { membersMapper } from "@/store/modules/members";
import {
  getFullName,
  getGenderName,
  getAgeFromBirthdate
} from "@/utils/filters";
import CreateMember from "./List/Create.vue";
import { Clubs } from "@/api";

export default Vue.extend({
  name: "MembersList",
  components: {
    CreateMember
  },
  data() {
    return {
      currentPage: 1,
      isLoading: true,
      isFetchError: false,
      clubs: [],
      membersOptions: {},
      membersHeaders: [
        {
          text: "ФИО",
          sortable: true,
          value: "last_name"
        },
        {
          text: "Клуб",
          sortable: true,
          value: "club_name"
        },
        {
          text: "Пол",
          sortable: false,
          value: "gender"
        },
        {
          text: "Возраст",
          sortable: true,
          value: "birthdate"
        }
      ],
      isCreatedNewMember: false,
      lastCreatedMember: {
        id: -1,
        clubId: -1,
        clubName: ""
      }
    };
  },
  watch: {
    membersOptions: {
      handler(val) {
        const { page, itemsPerPage: limit, sortBy, sortDesc } = val;
        const offset = (page - 1) * limit;

        if (sortBy.length === 1 && sortDesc.length === 1) {
          const sort = sortBy[0];
          const direction = sortDesc[0] ? "desc" : "asc";

          this.setSort({ sort, direction });
        }

        this.fetchMembersList(limit, offset);
      },
      deep: true
    }
  },
  mounted() {
    this.$root.$on("onCreatedNewMember", this.handleCreateMember);
  },
  computed: {
    ...membersMapper.mapGetters({
      isMembers: "isListNotEmpty"
    }),
    ...membersMapper.mapState({
      membersList: state => state.list,
      membersLimit: state => state.limit,
      membersOffset: state => state.offset,
      membersTotal: state => state.total,
      membersSort: state => state.sort,
      membersDirection: state => state.direction
    })
  },
  methods: {
    ...membersMapper.mapActions(["setMembers", "setSort"]),
    getFullName,
    getGenderName,
    getAgeFromBirthdate,
    async fetchMembersList(
      this: any,
      limit: number = this.membersLimit,
      offset: number = this.membersOffset
    ) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        await this.setMembers({ limit, offset });

        const { status: clubsStatus, data: clubsData } = await Clubs.getList(
          -1
        );

        if (clubsStatus === 200) {
          const { data: clubs } = clubsData;

          this.clubs = clubs;
        }

        this.isLoading = false;
      } catch (error) {
        this.isFetchError = true;
      }
    },
    memberLink(id: number) {
      return { name: "members-member", params: { id } };
    },
    clubLink(id: number) {
      return { name: "clubs-club", params: { id } };
    },
    async handleCreateMember(id: number, clubId: number, clubName: string) {
      this.lastCreatedMember.id = id;
      this.lastCreatedMember.clubId = clubId;
      this.lastCreatedMember.clubName = clubName;
      this.isCreatedNewMember = true;

      await this.fetchMembersList();
    }
  }
});
</script>
