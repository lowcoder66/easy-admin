import Input from "./input"

export default {
  mixins: [Input],
  props: {
    value: {
      default: "",
    },
    hideHint: {
      type: Boolean,
      default: true,
    },
    readonly: {
      type: Boolean,
      default: true,
    },
    hideDetails: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
  },
}
