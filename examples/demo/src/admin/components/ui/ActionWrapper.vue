<template>
  <v-card class="align-self-center" :class="displayMode === 'page' ? 'pa-4' : ''" min-width="500">
    <v-card-title>
      <component :is="displayMode === 'page' ? 'h2' : 'h3'">{{ title }}</component>
      <v-spacer />
      <ListButton :resource="resource" v-if="displayMode === 'page'" outlined />
      <v-btn v-else-if="displayMode === 'dialog'" icon @click="onClickClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>

<script>
import Form from "./Form"
import SaveButton from "./buttons/SaveButton"
import ListButton from "./buttons/RetrieveButton"
import ResetButton from "./buttons/ResetButton"

export default {
  components: { ResetButton, ListButton, SaveButton, Form },
  props: {
    title: String,
    resource: String,
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
  },
  methods: {
    onClickClose() {
      this.$emit("cancel")
    },
  },
}
</script>

<style scoped></style>
