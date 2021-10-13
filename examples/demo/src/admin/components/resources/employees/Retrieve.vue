<template>
  <TreeList :tree-props="treeProps" :list-props="listProps" @update:tree-active="onUpdateTreeActive" />
</template>

<script>
import TreeList from "../../ui/retrieve-layout/TreeList"

export default {
  components: { TreeList },
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [
        {
          source: "name",
          sortable: true,
        },
        {
          source: "phone",
          sortable: true,
        },
        "email",
      ],
      listFilter: {},
    }
  },
  computed: {
    treeProps() {
      return {
        resource: "departments",
        showItemAction: this.departmentsShowItemAction,
      }
    },
    listProps() {
      return {
        title: this.title,
        fields: this.fields,
        filter: this.listFilter,
      }
    },
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
