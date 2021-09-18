<template>
  <ActionButton
      v-bind="$attrs"
      :resource="resource"
      :display-mode="displayMode"
      :btn-icon="btnIcon || 'mdi-plus'"
      :color="color || 'primary'"
      :label="label"
      :action-key="actionKey"
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
  },
  computed: {
    actionKey() {
      return "create" + (this.action ? `=${this.action}` : "")
    },
  },
  methods: {
    onActionCompleted() {
      this.$emit('action-completed')
    }
  },
}
</script>

<style scoped>

</style>
