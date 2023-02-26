<template>
  <base-spinner :spinning="inProgress">
    <vue-flip
      :active-click="true"
      @click="queryTip"
      :height="height + 'rem'"
      :width="width + 'rem'"
    >
      <template v-slot:front>
        <base-card
          style="text-align: center; background-color: #f391e3"
          class="sign"
        >
          <p>{{ tip.issue }}</p>
        </base-card>
      </template>
      <template v-slot:back>
        <base-card style="text-align: center" class="sign">
          <p>{{ tip.output }}</p>
        </base-card>
      </template>
    </vue-flip>
  </base-spinner>
</template>
>
<script lang="ts">
import { apiBase, parseResponseData } from "@/helper/helper";
import type { ITips } from "@/model/tipsType";
import type { PropType } from "vue";
import { VueFlip } from "vue-flip";
export default {
  components: {
    "vue-flip": VueFlip,
  },
  props: {
    tip: {
      type: Object as PropType<ITips>,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      inProgress: false,
      isOff: true,
    };
  },
  created() {
    // this.queryTip()
  },
  methods: {
    async queryTip() {
      if (this.tip.todo) {
        this.tip.output = "Todo, or send your PR in github";
        return;
      }
      if (this.tip.output) {
        return;
      }

      this.isOff = !this.isOff;
      if (this.isOff) {
        console.log("off");
        return;
      }

      this.inProgress = true;
      const response = await fetch(`${apiBase}/querytip`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issue: this.tip.issue,
        }),
      });
      this.inProgress = false;
      const responseData = await parseResponseData(response);
      this.tip.output = "";
      //parse the response into friendly string.TODO: beautify
      if (responseData.code != 200) {
        console.log(responseData);
        this.tip.output = "Error: " + responseData.data;
      } else {
        for (const key in responseData.data) {
          if (responseData.data.hasOwnProperty(key)) {
            if (key == "errors") {
              this.tip.output = "Error: " + responseData.data[key][0]["reason"];
              break;
            }
            this.tip.output += `${key}: ${responseData.data[key]}\n`;
          }
        }
      }
    },
  },
};
</script>
<style scoped>
.sign {
  cursor: pointer;
}
.card {
  min-height: v-bind(height - 3 + "rem");
  width: v-bind(width + "rem");
  /* max-width: 10rem; */
}
</style>
