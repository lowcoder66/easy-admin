export default {
  data() {
    return {
      options: this.items,
    }
  },
  props: {
    items: null,
    itemText: {
      type: [String, Array, Function],
      default: "text",
    },
    itemValue: {
      type: [String, Array, Function],
      default: "value",
    },
    enumKey: String,
    enums: {
      type: Array,
      default() {
        let enumKey = `enums.${this.enumKey || this.source}`
        if (!this.$te(enumKey)) {
          return []
        }

        let enums = this.$t(enumKey)

        return Object.keys(enums).map((key) => {
          return {
            value: key,
            text: enums[key],
          }
        })
      },
    },
  },
  methods: {},
}
