<template>
  <ActionButton
    v-bind="$attrs"
    :resource="resource"
    :btn-icon="btnIcon || false"
    :color="color || 'primary'"
    :label="label || defaultLabel"
    :loading="formState && formState.saving"
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
      return this.$t("em.actions.save")
    },
  },
  methods: {
    onClick() {
      if (this.formState.submit) {
        this.formState.submit()
      }
    },
  },
}
</script>
