<template>
  <List :resource="resource" :action="action" :title="title" :fields="fields" :show-item-action="showItemAction" />
</template>

<script>
import List from "../../ui/retrieve-layout/List"

export default {
  components: { List },
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [
        {
          source: "name",
          sortable: true,
        },
        {
          source: "code",
          sortable: true,
        },
        {
          source: "builtIn",
          type: "boolean",
          sortable: true,
        },
        "description",
      ],
    }
  },
  methods: {
    showItemAction(item, action) {
      if (action === "show") {
        return false
      }
      return item && this.$admin.hasActionPermission(this.resource, action) && !item.builtIn
    },
  },
  async created() {},
}
</script>
