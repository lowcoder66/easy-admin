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
        if (enums instanceof Array) {
          return enums.map((item) => {
            if (typeof item === "string") {
              return {
                value: item,
                text: item,
              }
            } else {
              return {
                value: item[this.itemValue],
                text: item[this.itemText],
              }
            }
          })
        } else {
          return Object.keys(enums).map((key) => {
            return {
              value: key,
              text: enums[key],
            }
          })
        }
      },
    },
  },
  methods: {},
}
