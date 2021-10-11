<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :value="item"
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
    </EaForm>
  </EaActionWrapper>
</template>

<script>
import { guessInputs } from "@lowcoder/easy-admin/src/utils/guesser"

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
