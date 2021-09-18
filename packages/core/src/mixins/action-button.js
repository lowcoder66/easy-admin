import Resource from "./resource"

export default {
  mixins: [Resource],
  props: {
    actionKey: {
      type: String,
    },
    displayMode: {
      type: String,
      validator: (v) =>  v && ["page", "dialog", "drawer", ].includes(v),
      default: null,
    },
    label: {
      type: String,
    },
    item: null,
    id: null,
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
      if (action && this.actionDisplayMode === 'page') {
        return {
          name: `${this.resource}_${action.name}`,
          params: {
            id: this.id || this.item ? this.item.id : null,
          },
        };
      }
      return null
    },
  },
  methods: {
    onClick() {
      this.$emit("click", this.item)
    }
  },
}
