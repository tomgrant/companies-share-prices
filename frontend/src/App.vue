<template>
  <div id="app">
    <CompanyList />
  </div>
</template>

<script>
import CompanyList from './components/CompanyList.vue';

export default {
  name: 'App',
  components: {
    CompanyList,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
