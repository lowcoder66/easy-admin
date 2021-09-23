<template>
  <v-card class="align-self-center" :class="displayMode === 'page' ? 'pa-4' : ''">
    <v-card-title>
      <component :is="displayMode === 'page' ? 'h2' : 'h3'">{{ title }}</component>
      <v-spacer />
      <ListButton v-if="displayMode === 'page'" outlined />
      <v-btn v-else-if="displayMode === 'dialog'" icon large @click="onClickClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <Form :item="item" @saved="handleFormSaved" :redirect="displayMode === 'page' ? 'retrieve' : false">
        <ea-text-input source="name"></ea-text-input>
        <ea-text-input source="code"></ea-text-input>
        <ea-text-input source="description" multiline></ea-text-input>
      </Form>
    </v-card-text>
  </v-card>
</template>

<script>
import Form from "../../ui/Form"
import { guessInputs } from "@lowcoder/easy-admin/src/utils/guesser"
import SaveButton from "../../ui/buttons/SaveButton"
import ListButton from "../../ui/buttons/RetrieveButton"
import ResetButton from "../../ui/buttons/ResetButton"

export default {
  props: {
    title: String,
    resource: Object,
    item: Object,

    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
  },
  components: { ResetButton, ListButton, SaveButton, Form },
  data() {
    return {
      inputs: [],
    }
  },
  async created() {
    this.inputs = await guessInputs(this.$store, this.$i18n, this.resource.name)
  },
  methods: {
    handleFormSaved(data) {
      this.$emit("saved", data)
    },
    onClickClose() {
      this.$emit("cancel")
    },
  },
}
</script>

<style scoped></style>
