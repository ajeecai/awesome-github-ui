<template>
  <section class="center-area">
    <base-dialog
      v-if="!!retMsg"
      :type="retType"
      @ok="closeErrorDialog"
      @cancel="closeErrorDialog"
      class="center-area"
    >
      <p>{{ retMsg }}</p>
    </base-dialog>
    <base-spinner :spinning="isInLoginOrSignup">
      <Transition>
        <base-card v-if="switchModeText">
          <form @submit.prevent="">
            <div v-if="signMode == 'Sign Up'" class="form-control">
              <label for="name">Name</label>
              <input type="text" id="name" v-model.trim="userName" />
            </div>
            <div class="form-control">
              <label for="email">E-Mail</label>
              <input type="email" id="email" v-model.trim="email" />
            </div>
            <div class="form-control">
              <label for="password">Password</label>
              <input
                type="password"
                id="password"
                autocomplete="on"
                v-model.trim="password"
              />
              <password-meter
                v-if="signMode == 'Sign Up'"
                @score="onScore"
                :password="password"
              />
            </div>
            <div class="form-control" v-if="signMode == 'Sign Up'">
              <label for="repassword">Retype Password</label>
              <input
                type="password"
                id="repassword"
                autocomplete="on"
                v-model.trim="rePassword"
              />
              <password-meter @score="onScore" :password="rePassword" />
            </div>

            <div class="form-control">
              <vue-recaptcha
                v-show="showRecaptcha"
                sitekey="6Lcg_90jAAAAADVdbJbF2VM2iFXGz0g3gMIU_w8I"
                @verify="recaptchaVerified"
                @expired="recaptchaExpired"
                @error="recaptchaFailed"
                ref="recaptcha"
                ><base-button>{{ signMode }}</base-button>
              </vue-recaptcha>
              <div style="text-align: center">
                <span class="sign" @click="resetPass">Forget password</span>
                |
                <span @click="swichMode" class="sign">{{
                  switchModeText
                }}</span>
              </div>
            </div>
          </form>
        </base-card>
      </Transition>
    </base-spinner>
  </section>
</template>

<script lang="ts">
import type { IHttpResp } from "@/model/httpResType";
import { VueRecaptcha } from "vue-recaptcha";
import PasswordMeter from "vue-simple-password-meter";

export default {
  components: {
    VueRecaptcha,
    PasswordMeter,
  },
  data() {
    return {
      showRecaptcha: true,
      signMode: "Log In",
      switchModeText: "Sign Up",
      userName: "",
      email: "",
      password: "",
      rePassword: "",
      pswSecurity: "",
      retMsg: "",
      retType: "",
      isInLoginOrSignup: false,
    };
  },
  methods: {
    swichMode() {
      this.switchModeText = ""; // to trigger a transition
      setTimeout(async () => {
        this.switchModeText = this.signMode;
        if (this.signMode === "Log In") {
          this.signMode = "Sign Up";
        } else {
          this.signMode = "Log In";
        }
      }, 500);
    },
    closeErrorDialog() {
      this.retMsg = "";
      this.retType = "";
      this.resetReCaptCha();
    },
    recaptchaVerified(response: any) {
      console.log("recaptchaVerified ...");
      this.submitForm(response);
    },
    resetReCaptCha() {
      // when you need a reCAPTCHA challenge
      console.log("reset recaptcha");
      (this.$refs.recaptcha as any).reset();
    },
    recaptchaExpired() {
      // this.$refs.vueRecaptcha.reset();
      console.log("expired");
    },
    recaptchaFailed() {
      console.log("recaptchaFailed");
      this.resetReCaptCha();
    },

    onScore(payload: any) {
      // console.log(payload.score); // from 0 to 4
      // console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
      this.pswSecurity = payload.strength;
    },

    async submitForm(reCaptCha: string) {
      console.log("submitForm");

      if (this.signMode == "Sign Up") {
        this.retType = "Error";

        if (!this.password || !this.email || !this.userName) {
          this.retMsg = "None can be empty";
          return;
        }
        if (!this.email.includes("@")) {
          this.retMsg = "Incorrect email format";
          return;
        }
        if (this.password != this.rePassword) {
          this.retMsg = "password doesn't match";
          return;
        } else if (this.pswSecurity != "secure") {
          this.retMsg = "Password is not secure!";
          return;
        } else {
          this.retMsg = "";
          this.retType = "Information";
        }

        this.isInLoginOrSignup = true;
        let msg: IHttpResp = await this.$store.dispatch("auth/signUp", {
          userName: this.userName,
          userEmail: this.email,
          passWord: this.password,
          reCaptCha,
        });
        this.isInLoginOrSignup = false;

        if (msg.code == 200) {
          this.retMsg = msg.data;
          this.retType = "Information";
          this.swichMode();
          return;
        } else {
          this.retMsg = msg.data;
          this.retType = "Error";
        }
      } else {
        this.isInLoginOrSignup = true;
        let msg = await this.$store.dispatch("auth/loginUser", {
          userEmail: this.email,
          passWord: this.password,
          reCaptCha,
        });
        // console.log("return from login ", msg);
        this.isInLoginOrSignup = false;
        this.userName = this.$store.getters["auth/userName"];
        if (msg.code == 200) {
          //login ok
          this.$router.replace("home");
        } else {
          console.log("msg is ", msg);
          this.retMsg = msg.data;
          this.retType = "Error";
        }
      }
    },
    resetPass() {
      this.$router.push("/forgetpass");
    },
  },
};
</script>

<style scoped>
/* overwritting .card can change style of base-card */
.card {
  margin: 10%, 10%;
  width: 25rem;
}
button,
a {
  width: 100%;
  border-radius: 0;
  margin: 0.5rem 0 0.5rem 0;
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

.form-control {
  margin: 1rem 1rem;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
