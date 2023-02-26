<template>
  <header>
    <nav>
      <h1>
        <router-link to="/">Home</router-link>
      </h1>
      <ul>
        <li>
          <router-link to="/explore">Explore</router-link>
        </li>
        <li>
          <router-link to="/about">About</router-link>
        </li>
        <li>
          <router-link to="/auth" v-if="!userName">Login</router-link>
          <router-link to="/userinfo" v-else>{{ userName }}</router-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script lang="ts">
export default {
  computed: {
    userName() {
      return this.$store.getters["auth/userName"];
    },
  },
};
</script>
<style scoped>
header {
  width: 100%;
  height: 5rem;
  background-color: #1890ff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
}

header a {
  text-decoration: none;
  color: white;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
}
h1:active,
h1:hover,
a:active,
a:hover,
a.router-link-active {
  color: #f391e3;
  border: 1px solid #f391e3;
}

h1 {
  margin: 0;
}

h1 a {
  margin: 0;
}

header nav {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

li {
  margin: 0 0.5rem;
}
</style>
