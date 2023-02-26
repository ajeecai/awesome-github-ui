<template>
  <a-card class="card" :bordered="false"><slot></slot></a-card>
</template>
<script lang="ts">
export default {};
</script>
<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: none;
  margin: 1rem auto;
  max-width: auto;
}
</style>
