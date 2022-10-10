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
import ResourceForm from "../../mixins/resource-form"
import { guessInputs } from "@lowcoder66/easy-admin/src/utils/guesser"

export default {
  mixins: [ResourceForm],
  props: {
    title: String,
  },
  data() {
    return {
      inputs: [],
    }
  },
  async created() {
    this.inputs = await guessInputs(this.$store, this.$i18n, this.resource.name)
  },
}
</script>

<style scoped></style>
