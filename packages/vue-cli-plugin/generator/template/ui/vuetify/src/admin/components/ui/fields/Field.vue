<template>
  <component v-if="fieldComponent" :is="fieldComponent" v-bind="{ ...$attrs, ...$props }" class="mt-0 pt-0" />
  <v-tooltip v-else-if="width && omit" bottom max-width="40%" >
    <template v-slot:activator="{ on, attrs }">
      <div class="text-omit" :style="{width}" v-bind="attrs" v-on="on" >
        {{ formattedValue }}
      </div>
    </template>
    <span>{{ formattedValue }}</span>
  </v-tooltip>
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
    omit: {
      type: Boolean,
    },
    width: {
      type: [String, Number],
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

<style scoped>
.text-omit {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
