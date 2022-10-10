<template>
  <v-textarea
    v-if="multiline"
    :rows="rows"
    v-bind="{ ...$attrs, ...commonProps }"
    @change="change"
    @input="update"
  ></v-textarea>
  <v-text-field
    v-else
    v-bind="{ ...$attrs, ...commonProps }"
    @change="change"
    @input="update"
    :type="type"
  ></v-text-field>
</template>

<script>
import Input from "@lowcoder66/easy-admin/src/mixins/input"
export default {
  mixins: [Input],
  props: {
    value: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    multiline: Boolean,
    rows: {
      type: [String, Number],
      default: 3,
    },
  },
}
</script>
