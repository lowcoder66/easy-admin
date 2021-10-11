<template>
  <v-sheet width="100%" color="transparent">
    <v-row>
      <v-col cols="12" md="3">
        <v-card>
          <v-card-text>
            <DataTree
              :resource="treeResource || layout.treeResource"
              @update:active="onUpdateActive"
              :show-item-action="treeShowItemAction"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="9">
        <v-card>
          <v-card-text>
            <DataGrid :title="title" :fields="fields" :filter="listFilter" :show-item-action="listShowItemAction" />
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
    treeResource: String,
    listFilter: {
      type: Object,
      default: () => {},
    },
    treeShowItemAction: Function,
    listShowItemAction: Function,
  },
  methods: {
    onUpdateActive(items) {
      this.$emit("update:tree-active", items)
    },
  },
}
</script>

<style scoped></style>
