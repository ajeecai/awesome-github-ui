<template>
  <div class="center-area">
    <base-dialog
      class="center-area"
      v-if="!!retMsg"
      :type="retType"
      @ok="onOK"
      @cancel="doCancel"
    >
      <p>{{ retMsg }}</p>
    </base-dialog>
    <base-spinner :spinning="isInQuery">
      <base-card v-if="isDataReady">
        <div align="center">
          <base-badge :title="'Top 20 Growing repos of ' + id"></base-badge>
        </div>
        <base-card>
          <ul>
            <li v-for="repo in langMileStone.trend" :key="repo.reponame">
              <a :href="repo.repourl" target="_blank">{{ repo.reponame }}</a>
              (⭐️{{ repo.stars }} 🚀{{ repo.laststars }})
              <div style="font-size: smaller">{{ repo.repodesc }}</div>
            </li>
          </ul>
        </base-card>
        <!-- reaching star level -->
        <div align="center">
          <base-badge
            :title="'Reaching star level repos of ' + id"
          ></base-badge>
        </div>
        <base-card>
          <ul>
            <li v-for="repo in langMileStone.starLevel" :key="repo.reponame">
              <a :href="repo.repourl" target="_blank">{{ repo.reponame }}</a>
              (⭐️{{ repo.stars }}
              )
              <div style="font-size: smaller">{{ repo.repodesc }}</div>
            </li>
          </ul>
        </base-card>
        <div align="center">
          <base-button @click="subscribeTopic" :loading="inSubscribing"
            >Like it? Subscribe to this topic</base-button
          >
        </div>
      </base-card>
    </base-spinner>
  </div>
</template>
<script lang="ts">
import { apiBase, parseResponseData } from "@/helper/helper";

export default {
  props: ["id"],
  data() {
    return {
      retMsg: "",
      retType: "",
      isInQuery: true,
      isDataReady: false,
      inSubscribing: false,
      needAuth: false,
    };
  },
  created() {
    (async () => {
      console.log("send out for getLangMileStone");
      this.retMsg = await this.$store.dispatch("langs/getLangMileStone", {
        language: this.id,
        since: "weekly",
      });
      if (!!this.retMsg) {
        console.log("response is ", this.retMsg);
        this.retType = "Error";
      }
      this.isInQuery = false;
      // sometimes query completed but failed to get data due to network
      this.isDataReady = !!this.langMileStone.trend;
    })();
  },
  methods: {
    onOK() {
      this.retMsg = "";
      this.retType = "";
      this.inSubscribing = false;

      if (this.needAuth) {
        this.needAuth = false;
        this.$router.replace("/auth");
      }
    },
    doCancel() {
      this.retMsg = "";
      this.retType = "";
      this.inSubscribing = false;
    },
    async sendSubRequest() {
      console.log("subscribeTopic");
      this.inSubscribing = true;
      const response = await fetch(`${apiBase}/subscribetopic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenId: this.$store.getters["auth/tokenId"],
          subscription: this.id, //hard code for weekly now
        }),
      });
      const responseData = await parseResponseData(response);
      this.retMsg = responseData.data;
      if (responseData.code == 200) {
        this.retType = "Information";
      } else {
        this.retType = "Error";
      }
      this.inSubscribing = false;
      // console.log("resonseData ", responseData);
    },
    async subscribeTopic() {
      if (!this.isLogin) {
        this.retMsg = "Please login to proceed!";
        this.retType = "Warning";
        this.needAuth = true;
        return;
      }

      // const confirm = () => {
      //   Modal.confirm({
      //     title: "Warning",
      //     icon: createVNode(ExclamationCircleOutlined),
      //     content: "This will overwrite your exising subscription, continue?",
      //     okText: "ok",
      //     cancelText: "cancel",
      //     onOk: () => {
      //       this.sendSubRequest();
      //     },
      //     onCancel: () => {},
      //   });
      // };

      // confirm();
      this.sendSubRequest();
    },
  },
  computed: {
    langMileStone() {
      return this.$store.getters["langs/getLangMileStone"](this.id);
    },
    isLogin() {
      return !!this.$store.getters["auth/userEmail"];
    },
  },
};
</script>
<style scoped>
.card {
  max-width: 52rem;
}
li {
  margin: 1rem 1rem;
}
</style>
