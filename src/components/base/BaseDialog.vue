<template>
  <!-- <Transition name="dialog"> -->
  <a-modal :visible="true" @ok="okHandler" @cancel="cancelHandler">
    <template v-slot:title>
      <info-circle-two-tone
        v-if="type == 'Information'"
        style="font-size: x-large; color: green"
        two-tone-color="green"
      />
      <warning-two-tone
        v-if="type == 'Warning'"
        style="font-size: x-large; color: orange"
        two-tone-color="#eb2f96"
      />
      <close-circle-two-tone
        v-if="type == 'Error'"
        style="font-size: x-large; color: red"
        two-tone-color="#eb2f96"
      />
      {{ type }}</template
    >

    <slot></slot>
  </a-modal>
  <!-- </Transition> -->
</template>

<script lang="ts">
import {
  WarningTwoTone,
  CloseCircleTwoTone,
  InfoCircleTwoTone,
} from "@ant-design/icons-vue";
import type { PropType } from "vue";

declare type Type = "Warning" | "Error" | "Information" | undefined;
export default {
  components: {
    WarningTwoTone,
    CloseCircleTwoTone,
    InfoCircleTwoTone,
  },
  props: {
    // visible: {
    //   type: Boolean,
    //   required: true,
    //   default: false,
    // },
    type: {
      type: String as PropType<Type>,
      required: true,
      default: "Information",
    },
  },
  data() {
    return {};
  },
  emits: ["ok", "cancel"],
  methods: {
    okHandler() {
      this.$emit("ok");
    },
    cancelHandler() {
      this.$emit("cancel");
    },
  },
};
</script>

<style scoped>
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.dialog-enter-active {
  transition: all 0.3s ease-out;
}

.dialog-leave-active {
  transition: all 0.3s ease-in;
}

.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
