<template>
  <the-header></the-header>
  <router-view v-slot="{ Component }">
    <transition name="route" mode="out-in">
      <KeepAlive include="explore,userinfo"
        ><component :is="Component"
      /></KeepAlive>
    </transition>
  </router-view>
</template>

<script lang="ts">
import TheHeader from "./components/home/TheHeader.vue";
export default {
  components: {
    TheHeader,
  },
  created() {
    this.$store.dispatch("auth/autoLoginUser");
  },
};
</script>

<style>
/* overwritting the antd spin style, to let spinning in the center of area */
.ant-spin-nested-loading > div > .ant-spin .ant-spin-dot {
  transform: translate(-50%, -50%);
  margin: 0 !important;
  max-height: none !important;
}
.ant-spin-nested-loading > div > .ant-spin {
  max-height: none !important;
}
.center-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 5rem); /* 5rem is the height of header */
}

label {
  /* font-weight: bold; */
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #1890ff;
  background-color: #faf6ff;
  outline: none;
}
.route-enter-active,
.route-leave-active {
  transition: opacity 0.5s ease;
}
.route-enter-from,
.route-leave-to {
  opacity: 0;
}
</style>
