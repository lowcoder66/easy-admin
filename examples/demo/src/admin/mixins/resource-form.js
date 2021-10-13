export default {
  props: {
    resource: Object,
    item: Object,
    readonly: Boolean,
    id: {
      type: [String, Number],
    },
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
    redirect: {
      type: [String, Boolean],
      default: false,
    },
  },
  methods: {
    handleFormSaved(data) {
      this.$emit("saved", data)
    },
    onCancelAction() {
      this.$emit("cancel")
    },
  },
}
