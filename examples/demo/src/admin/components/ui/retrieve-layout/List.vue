<template>
  <v-card width="100%">
    <v-card-text>
      <DataGrid :show-select="showSelect" :title="title" :fields="fields" :show-item-action="showItemAction">
        <!-- 传递 slots -->
        <slot v-for="(_, name) in $slots" :name="name" :slot="name" />
        <template v-for="(_, name) in $scopedSlots" :slot="name" slot-scope="slotData">
          <slot :name="name" v-bind="slotData" />
        </template>
      </DataGrid>
    </v-card-text>
  </v-card>
</template>

<script>
import DataGrid from "../DataGrid"
import RetrieveLayout from "../../../mixins/retrieve-layout"

export default {
  mixins: [RetrieveLayout],
  components: { DataGrid },
}
</script>

<style scoped></style>
