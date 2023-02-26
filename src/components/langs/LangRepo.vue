<template>
  <div align="center">
    <router-link :to="'/lang' + link">{{ name }}</router-link>
  </div>
  <div align="center" style="font-size: smaller">{{ num }} repositories</div>
</template>
>
<script lang="ts">
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
};
</script>
