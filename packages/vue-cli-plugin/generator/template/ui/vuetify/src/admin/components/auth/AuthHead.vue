<template>
  <div class="text-center mb-8">
    <template v-if="showUserAvatar">
      <v-avatar color="primary" size="87">
        <span class="white--text headline">{{ name }}</span>
      </v-avatar>
    </template>
    <template v-else>
      <img alt="app-logo" src="@/assets/logo.svg" width="80" height="80" />
    </template>
  </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  name: "AuthHead",
  props: {
    inputUsername: {
      type: String,
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState("auth", {
      username: (state) => state.user && state.user.email,
      name: (state) => state.user && state.user.name,
    }),
    showUserAvatar() {
      return this.name && this.inputUsername === this.username
    },
  },
}
</script>

<style scoped></style>
