<template>
  <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      absolute
      top
      style="z-index: 999"
  ></v-progress-linear>
</template>

<script>
import {mapState} from "vuex"

export default {
  computed: {
    ...mapState('app', {
      loading: 'loading'
    }),
  }
}
</script>

<style scoped>

</style>
