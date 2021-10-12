<template>
  <ActionButton
    v-bind="$attrs"
    :resource="resource"
    :btn-icon="btnIcon || false"
    :color="color || 'primary'"
    :label="label || defaultLabel"
    :loading="form && form.saving"
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
      return this.$t("em.actions.save")
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
      if (this.form && this.form.submit) {
        this.form.submit()
      }
    },
  },
}
</script>
