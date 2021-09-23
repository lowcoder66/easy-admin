<template>
  <TreeList
    tree-resource="departments"
    :resource="resource"
    :action="action"
    :title="title"
    :fields="fields"
    :list-filter="listFilter"
    @update:tree-active="onUpdateTreeActive"
  />
</template>

<script>
import TreeList from "../../ui/retrieve-layout/TreeList"

export default {
  components: { TreeList },
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: ["name", "phone"],
      listFilter: {},
    }
  },
  methods: {
    onUpdateTreeActive(departments) {
      if (departments && departments.length > 0 && departments[0].id) {
        this.listFilter = { departmentId: departments[0].id }
      } else {
        this.listFilter = {}
      }
    },
  },
}
</script>
