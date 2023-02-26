// mutations for local state changes
import type { AuthState } from ".";

export default {
  setUser(state: AuthState, payload: AuthState) {
    // console.log(payload);
    state.userName = payload.userName;
    state.userEmail = payload.userEmail;
    state.tokenId = payload.tokenId;
  },
};
