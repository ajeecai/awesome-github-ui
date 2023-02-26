import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import type { IRepoDetails, ILangRepoStats } from "@/model/langRepoStatsType";

export interface LangState {
  langRepos: ILangRepoStats[];
  langMileStone: {
    [key: string]: { trend: IRepoDetails[]; starLevel: IRepoDetails[] };
  };
}

export default {
  namespaced: true,
  state(): LangState {
    return {
      langRepos: [],
      langMileStone: {},
    };
  },
  mutations,
  actions,
  getters,
};
