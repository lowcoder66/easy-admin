<template>
  <v-dialog
      v-if="showActionBtn && actionDisplayMode === 'dialog' "
      v-model="actionView"
      :persistent="currentAction.name !== 'show'"
      max-width="550">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-if="showActionBtn"
             v-bind="{...$attrs, ...attrs}"
             :small="small"
             v-on="on"
             :icon="icon"
             :color="color"
             @click="onClick">
        <v-icon :small="small" v-if="btnIcon" :left="!icon">{{ btnIcon }}</v-icon>
        <span v-if="!icon">{{ btnLabel || actionLabel }}</span>
      </v-btn>
    </template>

    <component :is="actionViewComponentName"
               :title="actionLabel"
               :resource="currentResource"
               :id="id"
               :item="item"
               :display-mode="actionDisplayMode ||'page' "
               @saved="handleFormSaved"
               @cancel="handleActionCancel"
    />
  </v-dialog>
  <v-btn v-else-if="showActionBtn"
         v-bind="$attrs"
         :icon="icon"
         :color="color"
         :to="actionRoute"
         :small="small"
         @click="onClick"
  >
    <v-icon :small="small" v-if="btnIcon" :left="!icon">{{ btnIcon }}</v-icon>
    <span v-if="!icon">{{ btnLabel || actionLabel }}</span>
  </v-btn>
</template>

<script>
import ActionButton from "@lowcoder/easy-admin/src/mixins/action-button"
import upperFirst from "lodash/upperFirst"
import {camelCase} from "lodash/string"

export default {
  components: {},
  mixins: [ActionButton],
  props: {
    btnIcon: {
      type: [Boolean, String],
      default () {
        return false
      }
    },
    icon: {
      type: Boolean,
      default () {
        return false
      },
    },
    color: {
      type: String,
    },
    btnLabel: {
      type: String,
    },
    small: Boolean,
  },
  data() {
    return {
      actionView : false,
    }
  },
  computed: {
    actionViewComponentName() {
      let componentName = `${upperFirst(camelCase(this.resource))}${upperFirst(this.currentAction.name)}`
      return componentName in this.$options.components ? componentName : `Ea${upperFirst(this.currentAction.name)}Guesser`
    },
  },
  methods: {
    handleFormSaved() {
      this.actionView = false
      this.$emit('action-completed')
    },
    handleActionCancel() {
      this.actionView = false
      this.$emit('action-canceled')
    },
  },
}
</script>

<style scoped>

</style>
