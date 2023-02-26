import type { IRepoDetails } from "@/model/langRepoStatsType";
import type { LangState } from ".";

export default {
  async setLangRepoStats(state: LangState, payload: any) {
    // console.log("resonse is ", responseData);
    state.langRepos = payload;
  },
  async setLangMileStone(state: LangState, payload: any) {
    state.langMileStone[payload.language] = payload.data;
  },
};
