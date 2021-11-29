<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="clientId" required />
      <EaTextInput source="clientName" required />
      <EaTextInput source="clientSecret" required />
      <EaAutocompleteInput source="authorities" multiple />
      <EaSelectInput source="grantTypes" multiple />
      <EaTextInput source="scopes" />
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
