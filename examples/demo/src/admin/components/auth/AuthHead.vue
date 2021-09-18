<template>
  <div class="text-center mb-8">
    <template v-if="showUserAvatar">
      <v-avatar color="primary" size="87">
        <span class="white--text headline">{{ name }}</span>
      </v-avatar>
    </template>
    <template v-else>
      <img alt="app-logo" src="@/assets/logo.svg" width="80" height="80"/>
    </template>
  </div>
</template>

<script>

export default {
  name: "AuthHead",
  props: {
    inputEmail: {
      type: String,
      default: null,
    }
  },
  data() {
    return {
      name: "张三",
      email: "zhangsan@some.com",
    }
  },
  computed: {

    showUserAvatar() {
      return this.name && this.inputEmail === this.email
    }
  },
}
</script>

<style scoped>

</style>
