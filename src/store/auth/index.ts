import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";
import type { IAuth } from "@/model/authType";

export interface AuthState {
  userName: string;
  userEmail: string;
  tokenId: string;
}

export default {
  namespaced: true,
  state(): AuthState {
    return {
      userName: "",
      userEmail: "",
      tokenId: "",
    };
  },
  mutations,
  actions,
  getters,
};
