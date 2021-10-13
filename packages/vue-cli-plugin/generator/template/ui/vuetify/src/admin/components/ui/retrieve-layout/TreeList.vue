<template>
  <v-sheet width="100%" color="transparent">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <DataTree v-bind="{ ...treeProps }" @update:active="onUpdateActive" />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card>
          <v-card-text>
            <DataGrid v-bind="{ ...listProps }" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
import DataGrid from "../DataGrid"
import RetrieveLayout from "../../../mixins/retrieve-layout"
import DataTree from "../DataTree"

export default {
  mixins: [RetrieveLayout],
  components: { DataTree, DataGrid },
  props: {
    treeProps: Object,
    listProps: Object,
  },
  methods: {
    onUpdateActive(items) {
      this.$emit("update:tree-active", items)
    },
  },
}
</script>

<style scoped></style>
