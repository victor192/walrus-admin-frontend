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
        <v-row>
          <v-col cols="3">
            <v-select
              v-model="clubId"
              :items="clubs"
              label="Клуб"
              item-text="name"
              item-value="id"
              @change="() => fetchMembersList()"
              clearable
              solo
            >
              <template #item="{ item }">
                <div class="d-flex flex-column text-left my-2">
                  <span class="font-weight-bold">{{ item.name }}</span>
                  <span>{{ item.location }}</span>
                </div>
              </template>
            </v-select>
          </v-col>
          <v-col cols="2">
            <v-select
              v-model="gender"
              :items="genders"
              label="Пол"
              item-text="text"
              item-value="value"
              @change="() => fetchMembersList()"
              clearable
              solo
            />
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="ageFilter"
              :items="ageGroups"
              label="Возрастная группа"
              item-text="text"
              item-value="value"
              @change="() => fetchMembersList()"
              clearable
              solo
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              :loading="isLoading"
              v-model="memberQuery"
              placeholder="Поиск участника"
              @change="searchMember"
              solo
            />
          </v-col>
        </v-row>
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
      <template #item.age="{ item }">
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
import { ClubData } from "@/store/interfaces/club-data.interface";

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
      clubs: [] as ClubData[],
      genders: [
        {
          text: "Мужчина",
          value: "male"
        },
        {
          text: "Женщина",
          value: "female"
        }
      ],
      gender: null,
      ageGroups: [
        {
          text: "До 18 лет",
          value: {
            min_age: null,
            max_age: 17
          }
        },
        {
          text: "18 - 39 лет",
          value: {
            min_age: 18,
            max_age: 39
          }
        },
        {
          text: "40 - 55 лет",
          value: {
            min_age: 40,
            max_age: 55
          }
        },
        {
          text: "56 лет и старше",
          value: {
            min_age: 56,
            max_age: null
          }
        }
      ],
      ageFilter: {
        min_age: null,
        max_age: null
      },
      memberQuery: "",
      clubId: null,
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
          sortable: true,
          value: "gender"
        },
        {
          text: "Возраст",
          sortable: true,
          value: "age"
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
      offset: number = this.membersOffset,
      search: string | null = null
    ) {
      this.isLoading = true;
      this.isFetchError = false;

      try {
        await this.setMembers({
          limit,
          offset,
          club_id: this.clubId,
          gender: this.gender,
          ...this.ageFilter,
          search
        });

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
    },
    async searchMember(query: string) {
      const search = query.length ? query : null;

      await this.fetchMembersList(
        this.membersLimit,
        this.membersOffset,
        search
      );
    }
  }
});
</script>
