<template>
  <ActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <Form
      :value="item"
      :id="id"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <component
        v-for="input in inputs"
        :key="input.source"
        :source="input.source"
        :is="`ea-${input.type}-input`"
      ></component>
    </Form>
  </ActionWrapper>
</template>

<script>
import Form from "../ui/Form"
import { guessInputs } from "@lowcoder/easy-admin/src/utils/guesser"
import ActionWrapper from "../ui/ActionWrapper"

export default {
  props: {
    title: String,
    resource: Object,
    item: Object,
    id: {
      type: [String, Number],
    },
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
  },
  components: { ActionWrapper, Form },
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
    onCancelAction() {
      this.$emit("cancel")
    },
  },
}
</script>

<style scoped></style>
