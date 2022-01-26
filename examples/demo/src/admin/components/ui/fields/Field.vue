<template>
  <component v-if="fieldComponent" :is="fieldComponent" v-bind="{ ...$attrs, ...$props }" class="mt-0 pt-0" />
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
    fieldComponent() {
      let component = null
      switch (this.type) {
        case "text":
        case "date":
        case "dateTime":
        case "number":
          component = null // text
          break
        case "boolean":
          component = `ea-boolean-input`
          break
        case "select":
        case "autocomplete":
          component = `ea-select-field`
          break
        default: {
          component = `ea-${this.type}-field`
        }
      }

      return component
    },
  },
  methods: {},
}
</script>
