<template>
  <section class="center-area">
    <base-dialog
      class="center-area"
      v-if="!!retMsg"
      :type="retType"
      @ok="gotoAuth"
      @cancel="doCancel"
    >
      <p>{{ retMsg }}</p></base-dialog
    >
    <div style="width: 36rem">
      <base-spinner :spinning="inProgress">
        <base-card v-if="!tokenId">
          <label for="email">To reset password, your email: </label>
          <input
            type="email"
            id="email"
            style="width: 80%; margin: 0.2rem 1rem; display: inline"
            v-model.trim="userEmail"
          />
          <base-button style="float: right" @click="sendResetEmail"
            >Send</base-button
          >
        </base-card>
        <!-- reset password -->
        <base-card v-else>
          <label for="email" style="margin: 1rem">Your email: </label>
          <input
            type="email"
            id="email"
            disabled
            style="width: 90%; margin: 0.2rem 1rem"
            v-model.trim="userEmail"
          />
          <label for="password" style="margin: 1rem">New password: </label>
          <input
            type="password"
            id="password"
            style="width: 90%; margin: 0.2rem 1rem"
            v-model.trim="passWord"
          />
          <password-meter
            style="max-width: 90%; margin: 0.2rem 1rem"
            @score="onScore"
            :password="passWord"
          />
          <label for="repassword" style="margin: 1rem">password again: </label>
          <input
            type="password"
            id="repassword"
            style="max-width: 90%; margin: 0.2rem 1rem"
            v-model.trim="rePassword"
          />
          <password-meter
            style="max-width: 90%; margin: 0.2rem 1rem"
            @score="onScore"
            :password="rePassword"
          />
          <div style="width: 90%">
            <base-button
              style="float: right; margin: 1rem 0rem"
              @click="changePassword"
              >OK</base-button
            >
          </div>
        </base-card>
      </base-spinner>
    </div>
  </section>
</template>
<script lang="ts">
import { apiBase, parseResponseData } from "@/helper/helper";
import sha256 from "sha256";
import PasswordMeter from "vue-simple-password-meter";

export default {
  props: ["query"],
  components: {
    PasswordMeter,
  },
  data() {
    return {
      userEmail: "",
      tokenId: "",
      passWord: "",
      rePassword: "",
      pswSecurity: "",
      isResetOK: false,
      inProgress: false,
      queryParams: {},
      retMsg: "",
      retType: "",
    };
  },
  created() {
    console.log("query", this.query);
    this.userEmail = this.query.email;
    this.tokenId = this.query.code;
  },
  methods: {
    async gotoAuth() {
      this.retMsg = "";
      this.retType = "";
      if (!this.tokenId || this.isResetOK) {
        this.$router.replace("/auth");
      }
    },
    async doCancel() {
      this.retMsg = "";
      this.retType = "";
    },
    async sendResetEmail() {
      this.inProgress = true;
      const url = `${apiBase}/resetpass?email=${encodeURIComponent(
        this.userEmail
      )}`;

      const response = await fetch(url);
      this.inProgress = false;
      const responseData = await parseResponseData(response);
      if (responseData.code == 200) {
        this.retMsg = "Please check your email and reset password!";
        this.retType = "Information";
      } else {
        this.retMsg = responseData.data;
        this.retType = "Error";
      }
    },
    onScore(payload: any) {
      // console.log(payload.score); // from 0 to 4
      // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      this.pswSecurity = payload.strength;
    },
    async changePassword() {
      if (this.passWord != this.rePassword) {
        this.retMsg = "Two passwords mismatched!";
        this.retType = "Error";
        return;
      }
      if (this.pswSecurity != "secure") {
        this.retMsg = "Password is not secure!";
        return;
      }
      this.inProgress = true;
      const url = `${apiBase}/resetpass?code=${
        this.tokenId
      }&email=${encodeURIComponent(this.userEmail)}&password=${sha256(
        this.passWord
      ).slice(0, 16)}`;

      const response = await fetch(url);
      this.inProgress = false;
      const responseData = await parseResponseData(response);
      if (responseData.code == 200) {
        this.retMsg = "Modify password OK !";
        this.retType = "Information";
        this.isResetOK = true;
      } else {
        this.retMsg = responseData.data;
        this.retType = "Error";
      }
    },
  },
};
</script>
