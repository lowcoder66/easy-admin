<template>
  <component v-if="type !== 'text'" :is="`ea-${type}-input`" v-bind="{ ...$attrs, ...$props }" class="mt-0 pt-0" />
  <span v-else>{{ value }}</span>
</template>

<script>
import Field from "@lowcoder/easy-admin/src/mixins/field"
export default {
  mixins: [Field],
  props: {
    type: {
      type: String,
      default: "text",
    },
  },
}
</script>
