<template>
  <ActionButton
    v-bind="$attrs"
    :resource="resource"
    :btn-icon="btnIcon || false"
    :color="color || 'default'"
    :label="label || defaultLabel"
    @click="onClick"
  />
</template>

<script>
import Button from "../../../mixins/button"
import ActionButton from "./ActionButton"

export default {
  components: { ActionButton },
  mixins: [Button],
  inject: {
    formState: { default: undefined },
  },
  computed: {
    defaultLabel() {
      return this.$t("em.actions.reset")
    },
  },
  methods: {
    onClick() {
      if (this.formState.reset) {
        this.formState.reset()
      }
    },
  },
}
</script>
