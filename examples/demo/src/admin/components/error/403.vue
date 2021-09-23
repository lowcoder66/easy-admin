<template>
  <div class="fill-height d-flex flex-column justify-center" style="width: 100%">
    <div class="text-center mb-4">
      <v-icon color="error darken-2" size="80">mdi-numeric-4-box</v-icon>
      <v-icon color="error darken-2" size="80">mdi-numeric-0-box</v-icon>
      <v-icon color="error darken-1" size="80">mdi-numeric-3-box</v-icon>
    </div>
    <div class="text-center mb-4">
      <h1 class="display-1 mb-1">Forbidden</h1>
      <h3>不允许查看！</h3>
    </div>
    <div class="text-center mb-4">
      <a class="text-decoration-underline" @click="$router.go(-1)">&lt; 返回</a>
      <router-link class="ml-4" :to="{ path: '/' }">首页 &gt;</router-link>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
