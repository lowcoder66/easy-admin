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
  methods: {
    getItemValue(item) {
      if (item) {
        if (typeof item === "string") {
          return item
        } else {
          if (typeof this.itemValue === "string") {
            return item[this.itemValue]
          } else if (this.itemValue instanceof Function) {
            return this.itemValue(item)
          }
        }
      }
      return null
    },
    getItemLabel(item) {
      if (item) {
        if (typeof item === "string") {
          return item
        } else {
          if (typeof this.itemText === "string") {
            return item[this.itemText]
          } else if (this.itemText instanceof Function) {
            return this.itemText(item)
          }
        }
      }
      return null
    },
  },
}
