<template>
  <v-card width="100%">
    <v-card-text>
      <DataGrid :title="title" :fields="fields" />
    </v-card-text>
  </v-card>
</template>

<script>
import DataGrid from "../DataGrid"
import RetrieveLayout from "../../../mixins/retrieve-layout"

export default {
  mixins: [RetrieveLayout],
  components: {DataGrid},
}
</script>

<style scoped>

</style>
