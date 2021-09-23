<template>
  <ActionButton
    v-bind="$attrs"
    :resource="resource"
    :display-mode="displayMode"
    :btn-icon="btnIcon || 'mdi-pencil'"
    :color="color || 'primary lighten-1'"
    :label="label"
    :btn-label="btnLabel"
    :action-key="actionKey"
    :id="id"
    :item="item"
    @click="onClick"
    @action-completed="onActionCompleted"
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
    item: null,
    id: null,
  },
  computed: {
    actionKey() {
      return "update" + (this.action ? `=${this.action}` : "")
    },
  },
  methods: {
    onActionCompleted() {
      this.$emit("action-completed")
    },
  },
}
</script>

<style scoped></style>
