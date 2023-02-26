import { apiBase, parseResponseData } from "@/helper/helper";
import type { ActionContext } from "vuex";
import type { LangState } from ".";

type Context = ActionContext<LangState, any>;

export default {
  async getLangRepoStats(context: Context) {
    // let apiUrl = context.rootGetters.apiUrl;

    let response = await fetch(`${apiBase}/langrepos`);
    const responseData = await parseResponseData(response);
    // console.log("response is ", response);
    if (responseData.code == 200) {
      return context.commit("setLangRepoStats", responseData.data);
    } else {
      console.log("Error: ", responseData.data);
      return responseData.data;
    }
  },
  async getLangMileStone(context: Context, payload: any) {
    const url = `${apiBase}/langmilestone?language=${encodeURIComponent(
      payload.language
    )}&since=${payload.since}`;
    console.log("url is ", url);
    let response = await fetch(url);
    const responseData = await parseResponseData(response);
    if (responseData.code == 200) {
      context.commit("setLangMileStone", {
        language: payload.language,
        data: responseData.data,
      });
    } else {
      return responseData.data;
    }
  },
};
