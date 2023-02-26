<template>
  <section class="center-area">
    <base-dialog
      class="center-area"
      v-if="!!retMsg"
      :type="retType!"
      @ok="closeErrorDialog"
      @cancel="closeErrorDialog"
    >
      <p>{{ retMsg }}</p>
    </base-dialog>
    <base-spinner :spinning="inProgress">
      <base-card>
        <h2>User Information</h2>
        <form @submit.prevent="">
          <div class="form-control">
            <label for="name">Name</label>
            <input type="text" id="name" v-model.trim="userName" />
          </div>
          <div class="form-control">
            <label for="email">E-Mail</label>
            <input
              type="email"
              id="email"
              readonly
              disabled
              v-model.trim="userEmail"
            />
          </div>
          <div class="form-control">
            <label for="password">Change Password</label>
            <input
              type="password"
              id="password"
              autocomplete="on"
              v-model.trim="passWord"
            />
            <password-meter @score="onScore" :password="passWord" />
          </div>
          <div class="form-control" v-if="passWord">
            <label for="repassword">Retype Password</label>
            <input
              type="password"
              id="repassword"
              autocomplete="on"
              v-model.trim="rePassWord"
            />
            <password-meter @score="onScore" :password="rePassWord" />
          </div>
          <div class="form-control">
            <label for="subscription">Your subscription</label>
            <div>
              <a-checkbox-group
                id="subscription"
                v-model:value="checkList"
                :options="subscription"
                style="margin: 0 0 1rem 0"
              />
              <base-button
                style="float: right; margin: 0 0 1rem 0"
                @click="unsubscribe"
                >unsubscribe</base-button
              >
            </div>
          </div>
          <div class="form-control">
            <base-button @click="modifyUserInfo">Modify</base-button>
            <base-button @click="logoutUser">Logout</base-button>
          </div>
        </form>
      </base-card>
    </base-spinner>
  </section>
</template>

<script lang="ts">
import { apiBase, parseResponseData } from "@/helper/helper";
import PasswordMeter from "vue-simple-password-meter";

export default {
  name: "userinfo",
  components: {
    PasswordMeter,
  },
  data() {
    return {
      userName: "",
      userEmail: "",
      tokenId: "",
      passWord: "",
      rePassWord: "",
      pswSecurity: "",
      checkList: [],
      subscription: [],
      inProgress: false,
      retMsg: "",
      retType: "",
    };
  },
  created() {
    this.userName = localStorage.getItem("userName") || "";
    this.userEmail = localStorage.getItem("userEmail") || "";
    this.tokenId = localStorage.getItem("tokenId") || "";
    (async () => {
      this.inProgress = true;
      // console.log("tokenId: ", this.tokenId);

      // In order not to cache by cdn, add a random number in query string to get userino,
      // since cdn in cloudfront is configured to take query string into account.
      const response = await fetch(
        `${apiBase}/getuserinfo?r=${Math.random()}`,
        {
          headers: { token: this.tokenId },
        }
      );
      const responseData = await parseResponseData(response);
      if (responseData.code == 200) {
        this.checkList = this.subscription = responseData.data.subscription
          ? responseData.data.subscription.split("&")
          : [];
        // console.log("subscription: ", this.subscription);
      } else {
        this.retMsg = responseData.data;
        this.retType = "Error";
      }

      this.inProgress = false;
    })();
  },
  methods: {
    closeErrorDialog() {
      this.retMsg = "";
      this.retType = "";
    },
    async unsubscribe() {
      this.inProgress = true;
      const response = await fetch(`${apiBase}/subscribetopic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: this.$store.getters["auth/tokenId"],
          unsubscribed: true,
          subscription: this.checkList, // new subscription without the unsubscribed one
        }),
      });
      const responseData = await parseResponseData(response);
      // console.log("responseData ", responseData);
      if (responseData.code == 200) {
        this.subscription = this.checkList;
        this.retMsg = "OK";
        this.retType = "Information";
      } else {
        this.retMsg = responseData.data;
        this.retType = "Error";
      }

      this.inProgress = false;
    },
    onScore(payload: any) {
      // console.log(payload.score); // from 0 to 4
      // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      this.pswSecurity = payload.strength;
    },
    async modifyUserInfo() {
      console.log("modifyUserInfo");

      this.retType = "Error";
      if (!this.userEmail || !this.userName) {
        this.retMsg = "useName or userEmail can't be empty";
        return;
      }
      if (!this.userEmail.includes("@")) {
        this.retMsg = "Incorrect email format";
        return;
      }
      if (this.passWord != this.rePassWord) {
        this.retMsg = "password doesn't match";
        return;
      } else if (this.passWord && this.pswSecurity != "secure") {
        this.retMsg = "Password is not secure!";
        return;
      } else {
        this.retMsg = "";
        this.retType = "";
      }

      this.inProgress = true;

      let msg = await this.$store.dispatch("auth/modifyUserInfo", {
        userName: this.userName,
        passWord: this.passWord,
        subscription: this.subscription,
      });
      this.inProgress = false;
      console.log(msg);
      if (msg.code == 200) {
        this.retMsg = "modify sucessfully";
        this.retType = "Information";
      } else {
        this.retMsg = msg.data;
        this.retType = "Error";
      }
    },
    async logoutUser() {
      await this.$store.dispatch("auth/logoutUser");
      this.$router.replace("home");
    },
  },
  watch: {
    // checkList(newValue, oldValue) {
    //   console.log("newValue ", newValue, ",oldValue ", oldValue);
    // },
  },
};
</script>

<style scoped>
/* overwritting .card can change style of base-card */
.card {
  margin: 10%, 10%;
  width: 39rem;
}
button,
a {
  border-radius: 0;
  margin: 0.5rem 0 0.5rem 1rem;
}
.sign {
  cursor: pointer;
  font-size: smaller;
}
.sign:hover,
.sign:active {
  color: #e2dde8;
}

form {
  margin: 1rem;
  padding: 1rem;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  margin-bottom: 1rem;
}
</style>
