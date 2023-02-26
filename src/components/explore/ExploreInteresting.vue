<template>
  <section class="content center-area">
    <base-dialog
      class="center-area"
      v-if="needAuth"
      type="Warning"
      @ok="gotoAuth"
      @cancel="doCancel"
    >
      <p>Please login to proceed!</p></base-dialog
    >
    <base-spinner :spinning="isInQuery">
      <div>
        <ul v-if="!isAskingChatGpt">
          <li v-for="t in tips" :key="t.issue">
            <tips-card :tip="t" :height="liHeight" :width="liWidth">
            </tips-card>
          </li>
        </ul>
        <base-card>
          <div class="askdiv">
            <label for="ask"
              >Ask ChatGPT
              <base-button
                v-if="isAskingChatGpt"
                style="float: right; padding: 0.2rem 0.2rem; margin: 0 0 0 1rem"
                @click="closeChat"
                >X</base-button
              ></label
            >
            <div style="display: flex; flex-flow: row">
              <input
                type="text"
                id="ask"
                placeholder="experiment, the response may take one or two minutes"
                v-model="askMessage"
              />
              <base-button
                style="padding: 0.2rem 0.2rem; margin: 0 0 0 1rem"
                :disabled="!askMessage"
                @click="askChatGpt"
                >go</base-button
              >
            </div>
            <div style="margin: 2rem 1rem 1rem 1rem">{{ askResponse }}</div>
          </div>
        </base-card>
      </div>
    </base-spinner>
  </section>
</template>
<script lang="ts">
import { apiBase, parseResponseData } from "@/helper/helper";
import seedrandom from "seedrandom";
import { detect } from "detect-browser";
import type { ITips } from "@/model/tipsType";
import Tips from "./Tips.vue";

export default {
  name: "explore",
  components: {
    "tips-card": Tips,
  },
  data() {
    return {
      askMessage: "",
      askResponse: "",
      cardShadow: "none",
      cardSize: "39rem",
      askDivSize: "",
      isAskingChatGpt: false,
      needAuth: false,
      liHeight: 10,
      liWidth: 10,
      cols: 3,
      conversationId: "",
      askMsgId: "",
      askRetries: 0,
      tips: [
        {
          issue: "Total repositories and commits",
          todo: false,
          output: "",
        },
        {
          issue: "The biggest repository",
          todo: false,
          output: "",
        },
        {
          issue: "Most commits last week",
          todo: false,
          output: "",
        },
        {
          issue: "The hottest repository",
          sql: "",
          legacy: false,
          todo: true,
          output: "",
        },
        {
          issue: "Which city has the most activities",
          sql: "",
          legacy: false,
          todo: true,
          output: "",
        },
        {
          issue: "Time distribution of commits",
          sql: "",
          legacy: false,
          todo: true,
          output: "",
        },
      ] as ITips[],
      isInQuery: false,
    };
  },
  created() {
    // create a random conversation id but consistent to this user and device (in a relatively long time).
    const browser = detect();
    const rng = seedrandom(
      this.$store.getters["auth/userName"] + JSON.stringify(browser)
    );
    this.conversationId = rng().toString().split(".")[1];
    console.log("conversationId is ", this.conversationId);
  },
  methods: {
    async sendChatReq(data: any) {
      // console.log("askMsgId ", this.askMsgId);
      const response = await fetch(`${apiBase}/chatgpt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("tokenId") || "invalid",
        },
        body: JSON.stringify({
          data,
        }),
      });
      const responseData = await parseResponseData(response);
      if (responseData.code == 200) {
        this.askResponse = responseData.data;
      } else {
        //server side timeout 10sec
        if (responseData.code == 204 && this.askRetries++ < 12) {
          console.log("try  polling %d", this.askRetries);
          // since chatgpt responds very slowly, need to poll for the result
          setTimeout(async () => {
            this.sendChatReq({
              polling: true,
              message_id: this.askMsgId,
              conversation_id: this.conversationId,
            });
          }, 10 * 1000);
          return;
        }
        this.askResponse =
          "Error:" + responseData.data ?? "Timeout" + ", please try later.";
      }
      this.isInQuery = false;
    },
    async askChatGpt() {
      if (!this.isLogin) {
        this.needAuth = true;
        return;
      }
      this.isAskingChatGpt = true;
      this.askResponse = "";
      this.isInQuery = true;
      this.askRetries = 0;
      this.askMsgId = Math.random().toString().split(".")[1];

      this.sendChatReq({
        polling: false,
        message_id: this.askMsgId,
        message: this.askMessage,
        conversation_id: this.conversationId,
      });
    },
    async gotoAuth() {
      this.needAuth = false;
      this.$router.replace("/auth");
    },
    async doCancel() {
      this.needAuth = false;
    },
    async closeChat() {
      this.isAskingChatGpt = false;
      this.askResponse = "";
      this.isInQuery = false;
      this.cardShadow = "none";
      this.cardSize = "39rem";
      this.askDivSize = "";
    },
  },
  computed: {
    isLogin() {
      return !!this.$store.getters["auth/userEmail"];
    },
    ulWidth() {
      return this.liWidth * this.cols + 1 * this.cols * 2; //1 is the margin of each side
    },
  },
  watch: {
    askMessage() {
      if (this.askMessage) {
        this.cardShadow = "0 2px 8px rgba(0, 0, 0, 0.26)";
        this.cardSize = "100%";
        this.askDivSize = "50rem";
        // console.log("cardSize ", this.cardSize);

        this.isAskingChatGpt = true;
      } else {
        // this.cardShadow = "none";
        // this.cardSize = "39rem";
        // this.isAskingChatGpt = false;
      }
    },
  },
};
</script>
<style scoped>
.card {
  box-shadow: v-bind(cardShadow);
  margin: 10%, 10%;
  width: v-bind(cardSize);
}

.askdiv {
  width: v-bind(askDivSize);
}

.content {
  width: v-bind(ulWidth + "rem");
  margin: auto;
  padding: auto;
}

ul {
  list-style: none;
  /* width: v-bind(ulWidth + "rem"); */
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}
li {
  text-align: center;
  width: v-bind(liWidth + "rem");
  margin: auto;
  height: auto;
  outline: none;
}
</style>
