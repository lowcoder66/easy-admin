<template>
  <component v-if="inputComponent" :is="inputComponent" v-bind="{ ...$attrs, ...$props }" class="mt-0 pt-0" />
  <span v-else>{{ formattedValue }}</span>
</template>

<script>
import Field from "@lowcoder/easy-admin/src/mixins/field"
import { formatDate, formatDateTime } from "@lowcoder/easy-admin/src/utils/dateUtils"
export default {
  mixins: [Field],
  props: {
    type: {
      type: String,
      default: "text",
    },
  },
  computed: {
    formattedValue() {
      let finalValue = this.value
      switch (this.type) {
        case "date":
          finalValue = formatDate(this.value)
          break
        case "dateTime":
          finalValue = formatDateTime(this.value)
          break
      }

      return finalValue
    },
    inputComponent() {
      let input = null
      switch (this.type) {
        case "text":
        case "date":
        case "dateTime":
          input = null // show as text
          break
        default: {
          return `ea-${this.type}-input`
        }
      }

      return input
    },
  },
  methods: {},
}
</script>
