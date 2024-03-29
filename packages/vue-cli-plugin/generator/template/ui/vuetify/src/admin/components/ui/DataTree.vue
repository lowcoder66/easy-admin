<template>
  <v-card flat tile :loading="loading">
    <v-treeview
      :open="openNodes"
      dense
      :items="[rootNode]"
      activatable
      :active="activeNodes"
      @update:active="onUpdateActive"
      @update:open="onUpdateOpen"
    >
      <template #append="{ item }">
        <CreateButton
          small
          icon
          v-if="showItemAction(item.dataItem, 'create')"
          :item="item.id ? item.dataItem : null"
          :resource="resource"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          @action-completed="fetchData"
        />
        <ShowButton
          small
          icon
          v-if="item.id && showItemAction(item.dataItem, 'show')"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('ea.actions.show')"
          :resource="resource"
          :id="item.id"
          :item="{ ...item.dataItem, parent: item.parent }"
        />
        <UpdateButton
          small
          icon
          v-if="item.id && showItemAction(item.dataItem, 'update')"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('ea.actions.update')"
          :resource="resource"
          :id="item.id"
          :item="{ ...item.dataItem, parent: item.parent }"
          @action-completed="fetchData"
        />
        <DeleteButton
          small
          icon
          v-if="item.id && showItemAction(item.dataItem, 'delete')"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('ea.actions.delete')"
          :resource="resource"
          :id="item.id"
          :item="{ ...item.dataItem, parent: item.parent }"
          @action-completed="fetchData"
        />
      </template>
    </v-treeview>
  </v-card>
</template>

<script>
import Resource from "@lowcoder66/easy-admin/src/mixins/resource"
import CreateButton from "./buttons/CreateButton"
import ShowButton from "./buttons/ShowButton"
import UpdateButton from "./buttons/UpdateButton"
import DeleteButton from "./buttons/DeleteButton"

export default {
  components: { DeleteButton, UpdateButton, ShowButton, CreateButton },
  mixins: [Resource],
  props: {
    loadData: Function,
    title: String,
    idKey: {
      type: String,
      default: "id",
    },
    labelKey: {
      type: String,
      default: "name",
    },
    nodeLabel: Function,
    childrenKey: {
      type: String,
      default: "children",
    },
    showItemAction: {
      type: Function,
      default: function (item, action) {
        return item && this.$admin.hasActionPermission(this.resource, action)
      },
    },
  },
  data: () => ({
    loading: false,
    rootNode: {
      id: 0,
      name: "tree",
      children: [],
    },
    items: [],
    totalItems: 0,
    retrieveParams: {
      sort: [],
      filter: {},
    },
    openNodes: [],
    openNodesCache: [],
    activeNodes: [0],
  }),
  computed: {
    treeTitle() {
      return this.title || this["$admin"].getResourceLabel(this.resource, 10)
    },
    activeItems() {
      return this.activeNodes
        .filter((id) => id)
        .map((id) => {
          return this.items.find((item) => id === item[this.idKey])
        })
        .filter((item) => !!item)
    },
  },
  methods: {
    async fetchData() {
      this.loading = true
      let { data, total } = this.loadData
        ? await this.loadData(this.retrieveParams)
        : await this.$store.dispatch(`${this.resource}/getTree`, this.retrieveParams)

      let flat = (node) => {
        return [node.dataItem, ...(node.children ? node.children.map((child) => flat(child)).flat() : [])]
      }
      this.totalItems = total
      this.rootNode.children = data.map((item) => this.formatTreeNode(item))
      this.items = this.rootNode.children.map((child) => flat(child)).flat()

      if (!this.openNodes || this.openNodes.length === 0) {
        this.openNodes = [0]
      } else {
        this.openNodes = this.openNodesCache
      }

      if (
        this.activeNodes &&
        this.activeNodes[0] &&
        !this.items.find((item) => this.activeNodes[0] === item[this.idKey])
      ) {
        this.activeNodes = [0]
      }
      this.loading = false
    },
    formatTreeNode(item, parent = null) {
      return {
        id: item[this.idKey],
        name: this.nodeLabel ? this.nodeLabel(item) : item[this.labelKey],
        children: item[this.childrenKey] ? item[this.childrenKey].map((child) => this.formatTreeNode(child, item)) : [],
        dataItem: item,
        parent: parent
          ? {
              id: parent[this.idKey],
              name: parent[this.labelKey],
            }
          : null,
      }
    },
    onUpdateActive(nodes) {
      this.activeNodes = nodes
    },
    onUpdateOpen(nodes) {
      this.openNodesCache = nodes
    },
  },
  watch: {
    activeNodes() {
      this.$emit("update:active", this.activeItems)
    },
  },
  async created() {
    this.rootNode.name = this.treeTitle
    await this.fetchData()
  },
}
</script>

<style scoped>
.loader-icon {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
