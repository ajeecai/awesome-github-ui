import type { AuthState } from ".";

export default {
  userName(state: AuthState) {
    return state.userName;
  },
  userEmail(state: AuthState) {
    return state.userEmail;
  },
  tokenId(state: AuthState) {
    return state.tokenId;
  },
};
