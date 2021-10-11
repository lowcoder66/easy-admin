<template>
  <TreeList
    tree-resource="departments"
    :resource="resource"
    :action="action"
    :title="title"
    :fields="fields"
    :list-filter="listFilter"
    :tree-show-item-action="departmentsShowItemAction"
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
    departmentsShowItemAction(item, action) {
      if (action === "show") {
        return false
      }
      return item && this.$admin.hasActionPermission(this.resource, action)
    },
  },
}
</script>
