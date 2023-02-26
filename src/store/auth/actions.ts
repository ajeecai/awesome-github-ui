//actions for logic handling then commit a mutation if needed
import type { ActionContext } from "vuex";
import type { AuthState } from ".";
import sha256 from "sha256";
import type { IHttpResp } from "@/model/httpResType";
import { apiBase, parseResponseData } from "@/helper/helper";

type Context = ActionContext<AuthState, any>;

export default {
  async autoLoginUser(context: Context) {
    let userEmail = localStorage.getItem("userEmail") || "";
    let userName = localStorage.getItem("userName") || "";
    let tokenId = localStorage.getItem("tokenId") || "";
    if (!tokenId) {
      return;
    }
    const currentTime = new Date().getTime();
    // token format: random-email(base64)-timestamp
    const tokenCreatedTime = tokenId?.split("-")[2];
    if (
      tokenCreatedTime &&
      currentTime < +tokenCreatedTime + 12 * 3600 * 1000
    ) {
      context.commit("setUser", {
        userName,
        userEmail,
        tokenId,
      });
    } else {
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userName");
      localStorage.removeItem("tokenId");
    }
  },
  async loginUser(context: Context, auth: any) {
    // console.log("payload is ", auth);
    if (!auth.userEmail || !auth.passWord) {
      return { code: 400, data: "no userEmail or passWord" } as IHttpResp;
    }
    auth.passWord = sha256(auth.passWord).slice(0, 16);
    const response = await fetch(`${apiBase}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(auth),
    });
    const responseData = await parseResponseData(response);
    // console.log("response ", responseData);
    if (responseData.code == 200) {
      const userName = responseData.data.userName;
      const userEmail = auth.userEmail;
      const tokenId = responseData.data.tokenId;

      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("tokenId", tokenId);

      context.commit("setUser", {
        userName,
        userEmail,
        tokenId,
      });
    }
    return responseData;
  },
  logoutUser(context: Context) {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("tokenId");

    context.commit("setUser", { userName: "", userEmail: "" });
  },
  // almost the same as login
  async modifyUserInfo(context: Context, user: any) {
    // console.log("payload is ", auth);
    let tokenId = localStorage.getItem("tokenId") || "";
    if (user.passWord) {
      user.passWord = user.passWord ? sha256(user.passWord).slice(0, 16) : "";
    }

    const response = await fetch(`${apiBase}/modifyuserinfo`, {
      method: "POST",
      headers: { Token: tokenId, "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const responseData = await parseResponseData(response);
    // console.log("response ", responseData);
    if (responseData.code == 200) {
      const userName = responseData.data.userName;
      const userEmail = responseData.data.userEmail;
      const tokenId = responseData.data.tokenId;

      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);
      localStorage.setItem("tokenId", tokenId);

      context.commit("setUser", {
        userName,
        userEmail,
        tokenId,
      });
    }
    return responseData;
  },

  async signUp(context: Context, user: any) {
    // console.log("payload is ", auth);
    if (!user.userName || !user.passWord) {
      return { code: 400, data: "no userEmail or passWord" } as IHttpResp;
    }
    user.passWord = user.passWord ? sha256(user.passWord).slice(0, 16) : "";
    const response = await fetch(`${apiBase}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const responseData = await parseResponseData(response);
    // console.log(responseData);
    return responseData;
  },
};
