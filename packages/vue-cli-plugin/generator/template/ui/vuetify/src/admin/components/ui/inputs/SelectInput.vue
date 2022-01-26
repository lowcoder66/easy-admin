<template>
  <v-select
    v-bind="{ ...$attrs, ...commonProps }"
    :chips="chip"
    :multiple="multiple"
    :item-text="itemText"
    :item-value="itemValue"
    :items="options || enums"
    :loading="loading"
    @change="change"
    @input="update"
  >
  </v-select>
</template>

<script>
import Input from "@lowcoder/easy-admin/src/mixins/input"
import Multiple from "@lowcoder/easy-admin/src/mixins/multiple"
import Select from "@lowcoder/easy-admin/src/mixins/select"
import Reference from "@lowcoder/easy-admin/src/mixins/reference"

export default {
  mixins: [Input, Multiple, Select, Reference],
  props: {
    chip: {
      type: Boolean,
      default() {
        return true
      },
    },
  },
  async created() {
    if (this.reference) {
      this.options = this.referenceData
    }
  },
  watch: {
    referenceData(val) {
      if (val && this.reference) {
        this.options = val
      }
    },
  },
}
</script>
