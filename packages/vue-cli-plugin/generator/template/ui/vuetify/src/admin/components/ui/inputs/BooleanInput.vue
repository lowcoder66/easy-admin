<template>
  <v-switch
    :false-value="false"
    :true-value="true"
    :input-value="input"
    v-bind="{ ...$attrs, ...commonProps }"
    @change="changeState"
  ></v-switch>
</template>

<script>
import Input from "@lowcoder/easy-admin/src/mixins/input"
export default {
  mixins: [Input],
  props: {
    value: Boolean,
  },
  methods: {
    changeState(value) {
      this.change(value)
      this.update(value)
    },
  },
}
</script>
