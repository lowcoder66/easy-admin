<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      readonly
      :id="id"
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput readonly source="code" required />
      <EaTextInput source="name" required />
      <EaTextInput source="description" multiline />
      <EaTransferInput source="authorities" reference="authorities" />
    </EaForm>
  </EaActionWrapper>
</template>

<script>
import ResourceForm from "../../../mixins/resource-form"
export default {
  mixins: [ResourceForm],
  props: {
    title: String,
  },
  data() {
    return {}
  },
}
</script>

<style scoped></style>
