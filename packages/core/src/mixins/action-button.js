import Resource from "./resource"

export default {
  mixins: [Resource],
  props: {
    actionKey: {
      type: String,
    },
    displayMode: {
      type: String,
      validator: (v) => v && ["page", "dialog", "drawer"].includes(v),
      default: null,
    },
    label: {
      type: String,
    },
    item: null,
    id: null,
    useLatestItem: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      latestItem: null,
    }
  },
  created() {
    this.latestItem = this.item
  },
  computed: {
    actionDisplayMode() {
      const action = this.currentAction
      return this.displayMode || (action ? action.displayMode : null)
    },
    currentAction() {
      return this["$admin"].getAction(this.resource, this.actionKey)
    },
    showActionBtn() {
      return !this.actionKey || this["$admin"].hasActionPermission(this.resource, this.actionKey)
    },
    actionLabel() {
      return this.label || this["$admin"].getActionLabel(this.resource, this.actionKey)
    },
    actionRoute() {
      const action = this.currentAction
      if (action && this.actionDisplayMode === "page") {
        return {
          name: `${this.resource}_${action.name}`,
          params: {
            id: this.id || this.item ? this.item.id : null,
          },
        }
      }
      return null
    },
  },
  methods: {
    async onClick() {
      if (this.actionDisplayMode !== "page" && this.id && this.useLatestItem) {
        try {
          let { data } = await this.$admin.store.dispatch(`${this.resource}/getOne`, {
            id: this.id,
          })
          this.latestItem = data
        } catch ({ status, message }) {
          console.warn(message)
        }
      }

      this.$emit("click", this.latestItem)
    },
  },
}
