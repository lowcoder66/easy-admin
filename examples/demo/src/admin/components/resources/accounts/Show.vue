<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      readonly
      :id="id"
      :value="item"
      :resource="resource.name"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="name" />
      <EaTextInput source="phone" />
      <EaTextInput source="email" />
      <EaBooleanInput source="enabled" />
      <EaAutocompleteInput source="authorities" :items="item['authorities']" multiple />
      <EaDateTimeInput source="registerTime" />
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
