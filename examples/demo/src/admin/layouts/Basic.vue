<template>
  <v-app>
    <Loading />
    <Messages />

    <v-main>
      <v-container fluid class="fill-height pa-6 grey lighten-4">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Loading from "./Loading"
import Messages from "./Messages"

export default {
  components: { Loading, Messages },
}
</script>

<style scoped></style>
