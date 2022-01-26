<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :id="id"
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="application" required readonly />
      <EaSelectInput source="profile" enumKey="profiles" required readonly />
      <EaTextInput source="label" required readonly />
      <EaTextInput source="key" required readonly />
      <EaTextInput source="value" />
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
