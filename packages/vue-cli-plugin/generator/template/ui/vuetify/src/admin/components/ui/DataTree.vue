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
          :item="item && item.id ? item : null"
          :resource="resource"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          @action-completed="fetchData"
        />
        <ShowButton
          small
          icon
          v-if="item.id"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('em.actions.show')"
          :resource="resource"
          :id="item.id"
          :item="item"
        />
        <UpdateButton
          small
          icon
          v-if="item.id"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('em.actions.update')"
          :resource="resource"
          :id="item.id"
          :item="item"
          @action-completed="fetchData"
        />
        <DeleteButton
          small
          icon
          v-if="item.id"
          :display-mode="$admin.options.defaultTreeActionDisplayMode"
          :btn-label="$i18n.t('em.actions.delete')"
          :resource="resource"
          :id="item.id"
          :item="item"
          @action-completed="fetchData"
        />
      </template>
    </v-treeview>
  </v-card>
</template>

<script>
import Resource from "@lowcoder/easy-admin/src/mixins/resource"
import CreateButton from "./buttons/CreateButton"
import ShowButton from "./buttons/ShowButton"
import UpdateButton from "./buttons/UpdateButton"
import DeleteButton from "./buttons/DeleteButton"

export default {
  components: { DeleteButton, UpdateButton, ShowButton, CreateButton },
  mixins: [Resource],
  props: {
    title: String,
    idKey: {
      type: String,
      default: "id",
    },
    labelKey: {
      type: String,
      default: "name",
    },
    childrenKey: {
      type: String,
      default: "children",
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
      let { data, total } = await this.$store.dispatch(`${this.resource}/getTree`, this.retrieveParams)

      let flat = (node) => {
        return [node.item, ...(node.children ? node.children.map((child) => flat(child)).flat() : [])]
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
    formatTreeNode(item) {
      return {
        id: item[this.idKey],
        name: item[this.labelKey],
        children: item[this.childrenKey] ? item[this.childrenKey].map((child) => this.formatTreeNode(child)) : [],
        item: item,
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
