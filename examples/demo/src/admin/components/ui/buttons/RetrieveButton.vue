<template>
  <ActionButton
    v-bind="$attrs"
    :resource="resource"
    :btn-icon="btnIcon || 'mdi-view-list'"
    :color="color || 'info'"
    :label="label"
    :action-key="actionKey"
  />
</template>

<script>
import ActionButton from "./ActionButton"
import Button from "../../../mixins/button"

export default {
  mixins: [Button],
  components: { ActionButton },
  props: {
    action: {
      type: String,
    },
  },
  computed: {
    actionKey() {
      return "retrieve" + (this.action ? `=${this.action}` : "")
    },
  },
}
</script>

<style scoped></style>
