<template>
  <a-spin :spinning="spinning" :indicator="indicator"><slot></slot> </a-spin>
</template>
<script lang="ts">
import { Loading3QuartersOutlined } from "@ant-design/icons-vue";
import { h } from "vue";
export default {
  props: {
    spinning: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      indicator: h(Loading3QuartersOutlined, {
        style: {
          fontSize: "58px",
        },
        spin: true,
      }),
    };
  },
};
</script>
<style scoped></style>
