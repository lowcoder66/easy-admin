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
    actionState: { default: undefined },
  },
  computed: {
    defaultLabel() {
      return this.$t("em.actions.reset")
    },
    form() {
      if (this.formState) {
        return this.formState
      } else if (this.actionState && this.actionState.form) {
        return this.actionState.form
      }
      return null
    },
  },
  methods: {
    onClick() {
      if (this.form && this.form.reset) {
        this.form.reset()
      }
    },
  },
}
</script>
