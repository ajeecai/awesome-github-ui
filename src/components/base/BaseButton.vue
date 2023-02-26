<template>
  <a-button v-if="!link" :type="type" :loading="loading">
    <slot></slot>
  </a-button>
  <router-link v-else :to="to" :class="type">
    <slot></slot>
  </router-link>
</template>

<script lang="ts">
import type { PropType } from "vue";
declare type Type = "primary" | "default" | "dash" | "text" | "link";
export default {
  props: {
    type: {
      type: String as PropType<Type>,
      required: false,
      default: "primary",
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    link: {
      type: Boolean,
      required: false,
      default: false,
    },
    to: {
      type: String,
      required: false,
      default: "/",
    },
  },
};
</script>

<style scoped>
button,
a {
  border-radius: 10px;
  border-color: #1890ff;
  background: none;
  color: #1890ff;
}

a:hover,
a:active,
button:hover,
button:active {
  border: 1ptx;
  background-color: #1890ff;
}
</style>
