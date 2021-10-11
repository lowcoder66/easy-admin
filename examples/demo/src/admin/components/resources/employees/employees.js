export default {
  props: {
    title: String,
    resource: Object,
    item: Object,
    id: {
      type: [String, Number],
    },
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
  },
  data() {
    return {}
  },
  methods: {
    handleFormSaved(data) {
      this.$emit("saved", data)
    },
    onCancelAction() {
      this.$emit("cancel")
    },
    authoritiesFetchFilter(model) {
      return {
        roleIds: model["roles"],
      }
    },
  },
}
