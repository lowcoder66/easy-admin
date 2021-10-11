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
  },
  data() {
    return {
      latestItem: this.item,
    }
  },
  watch: {
    item(val) {
      if (!this.refreshItem) {
        this.latestItem = val
      }
    },
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
    refreshItem() {
      // only update and show
      if (
        this.actionDisplayMode !== "page" &&
        this.currentAction &&
        ["update", "show"].includes(this.currentAction.name)
      ) {
        if (Object.keys(this.currentAction).includes("refreshItem")) {
          return this.currentAction["refreshItem"]
        }
        return this.$admin.options.refreshItemBeforeClickAction
      } else {
        return false
      }
    },
  },
  methods: {
    async onClick() {
      if (this.refreshItem) {
        try {
          let { data } = await this.$admin.store.dispatch(`${this.resource}/getOne`, {
            id: this.id,
          })
          this.latestItem = data
        } catch (err) {
          console.warn(err)
        }
      }

      this.$emit("click", this.latestItem)
    },
  },
}
