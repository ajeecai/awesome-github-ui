<template>
  <div class="content center-area">
    <base-dialog
      class="center-area"
      v-if="!!retMsg"
      :type="retType"
      @ok="closeErrorDialog"
      @cancel="closeErrorDialog"
      >{{ retMsg }}</base-dialog
    >
    <base-spinner :spinning="isInQuery">
      <div v-if="langRepos.length">
        <ul>
          <li v-for="lang in langRepos" :key="lang.name">
            <base-card>
              <lang-repo
                :name="lang.name"
                :num="lang.repoCount"
                :link="'/' + lang.name"
              >
              </lang-repo>
            </base-card>
          </li>
        </ul>
        <div v-if="repoList.length">
          <span class="sign" @click="onMore">more...</span>
          <span style="float: right">
            <label for="filter">filter</label>
            <input type="text" id="filter" v-model.trim="filter" />
          </span>
        </div>
      </div>
    </base-spinner>
  </div>
</template>
<script lang="ts">
import LangRepo from "../langs/LangRepo.vue";
import type { ILangRepoStats } from "@/model/langRepoStatsType";
export default {
  components: {
    "lang-repo": LangRepo,
  },
  data() {
    return {
      retMsg: "",
      retType: "",
      isInQuery: true,
      repoList: [] as ILangRepoStats[],
      numOfShown: 9,
      filter: "",
      liWidth: 12,
      cols: 3,
    };
  },
  created() {
    (async () => {
      console.log("send out for getLangRepoStats");
      this.retMsg = await this.$store.dispatch("langs/getLangRepoStats");
      if (!!this.retMsg) {
        console.log("response is ", this.retMsg);
        this.retType = "Error";
      }
      this.isInQuery = false;
    })();
  },
  methods: {
    onMore() {
      this.numOfShown += 9;
    },
    closeErrorDialog() {
      this.retMsg = "";
      // this.retType = "";
    },
  },

  watch: {
    filter() {
      this.numOfShown = 9;
    },
    repoList(newValue, _oldValue) {
      if (newValue.length) {
        this.isInQuery = false;
      } else {
        this.isInQuery = true;
      }
      // console.log("repoList: isInQuery ", this.isInQuery);
    },
  },
  computed: {
    langRepos() {
      let a: ILangRepoStats[];
      this.repoList = this.$store.getters[
        "langs/getLangRepos"
      ] as ILangRepoStats[];

      if (this.filter) {
        const filterLowCase = this.filter.toLowerCase();
        a = this.repoList.filter((i) =>
          i.name.toLowerCase().includes(filterLowCase)
        );
      } else {
        a = this.repoList.slice(0, this.numOfShown);
      }
      return (a || []) as ILangRepoStats[];
    },
    ulWidth() {
      return this.liWidth * this.cols + 1 * this.cols * 2; //1 is the margin of each side
    },
  },
};
</script>
<style scoped>
.sign {
  cursor: pointer;
  color: #1890ff;
  margin-left: 1rem;
}
.content {
  width: v-bind(ulWidth + "rem");
  margin: auto;
  padding: auto;
}
ul {
  list-style: none;
  /* width: v-bind(ulWidth + "rem"); */
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
li {
  text-align: center;
  width: v-bind(liWidth + "rem");
  margin: 1rem;
  height: auto;
  outline: none;
}
label {
  font-weight: normal;
  float: left;
  margin: 0rem 0.5rem;
  margin-bottom: 0;
  padding: 3px;
}
input,
textarea {
  display: inline-block;
  width: auto;
  margin-right: 1rem;
}
</style>
