import Resource from "@lowcoder66/easy-admin/src/mixins/resource"

export default {
  mixins: [Resource],
  props: {
    btnIcon: {
      type: [Boolean, String],
      default() {
        return false
      },
    },
    color: {
      type: String,
    },
    label: {
      type: String,
    },
    btnLabel: {
      type: String,
    },
    displayMode: {
      type: String,
      validator: (v) => v && ["page", "dialog", "drawer"].includes(v),
      default: null,
    },
  },
  methods: {
    onClick(item) {
      this.$emit("click", item)
    },
  },
}
