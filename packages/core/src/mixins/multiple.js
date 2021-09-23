export default {
  props: {
    value: {
      type: [String, Array],
      default() {
        return this.multiple ? [] : null
      },
    },
    multiple: Boolean,
  },
}
