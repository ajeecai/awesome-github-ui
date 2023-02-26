import type { LangState } from ".";

export default {
  getLangRepos(state: any) {
    return state.langRepos;
  },
  // getter with parameters
  getLangMileStone(state: LangState) {
    return function (lang: string) {
      return state.langMileStone[lang];
    };
  },
};
