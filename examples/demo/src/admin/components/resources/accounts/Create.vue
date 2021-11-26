<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="name" required />
      <EaTextInput source="phone" required />
      <EaTextInput source="email" />
      <EaBooleanInput source="enabled" :value="true" />
      <EaAutocompleteInput source="authorities" multiple />
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
}
</script>

<style scoped></style>
