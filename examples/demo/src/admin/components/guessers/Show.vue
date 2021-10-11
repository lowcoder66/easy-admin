<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      readonly
      :id="id"
      :value="item"
      :resource="resource.name"
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
    id: {
      type: [String, Number],
    },
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
    onCancelAction() {
      this.$emit("cancel")
    },
  },
}
</script>

<style scoped></style>
