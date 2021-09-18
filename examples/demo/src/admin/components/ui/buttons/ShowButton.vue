<template>
  <ActionButton
      v-bind="$attrs"
      :resource="resource"
      :display-mode="displayMode"
      :btn-icon="btnIcon || 'mdi-dots-horizontal-circle'"
      :color="color || 'secondary'"
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
  components: {ActionButton},
  props: {
    action: {
      type: String,
    },
    item: null,
    id: null,
  },
  computed: {
    actionKey() {
      return "show" + (this.action ? `=${this.action}` : "")
    },
  },
  methods: {
    onActionCompleted() {
      this.$emit('action-completed')
    }
  }
}
</script>

<style scoped>

</style>
