<template>
  <EaTreeList :tree-props="treeProps" :list-props="listProps" @update:tree-active="onUpdateTreeActive" />
</template>

<script>
export default {
  props: ["resource", "title", "action"],
  data() {
    return {
      activePosition: null,
      employeesFilter: {},
    }
  },
  computed: {
    treeProps() {
      return {
        resource: "positions",
        loadData: function (params) {
          return this.$store.dispatch("positions/getList", params)
        },
        showItemAction: function (item, action) {
          if (action === "show") {
            return false
          }
          if (action === "create") {
            return !item
          }
          if (action === "update") {
            return true
          }
          return item && this.$admin.hasActionPermission(this.resource, action) && !item["builtIn"]
        },
        nodeLabel: function (position) {
          return `${position.name} - ${position.code}`
        },
      }
    },
    listProps() {
      return {
        resource: "employees",
        title:
          (this.activePosition ? `${this.activePosition.name} - ` : "") +
          this.$admin.getResourceLabel("employees") +
          this.$t("ea.list.label"),
        fields: ["name", "phone", "email"],
        filter: this.employeesFilter,
        hideRowActions: true,
        hideActions: true,
      }
    },
  },
  methods: {
    onUpdateTreeActive(positions) {
      if (positions && positions.length > 0 && positions[0].code) {
        this.activePosition = positions[0]
        this.employeesFilter = { positionCodes: positions[0].code }
      } else {
        this.activePosition = null
        this.employeesFilter = {}
      }
    },
  },
  async created() {},
}
</script>
