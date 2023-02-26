<template>
  <a-card class="badge" :bordered="false"><slot></slot></a-card>
</template>

<script lang="ts">
export default {};
</script>

<style scoped>
.badge {
  background-color: #f391e3;
  border-radius: 16px;
  box-shadow: none;
  padding: 0 !important;
  margin: 0;
  max-width: fit-content;
  max-width: fit-content;
  font-style: bold;
}
</style>
