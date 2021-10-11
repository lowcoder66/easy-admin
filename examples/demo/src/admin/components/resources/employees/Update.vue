<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :value="item"
      :id="id"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput required source="phone" />
      <EaTextInput required source="name" />
      <EaTextInput source="email" />
      <EaTextInput source="no" />
      <EaSelectInput
        multiple
        source="departments"
        reference="departments"
        item-text="name"
        item-value="id"
        :fetch-filter="{ all: true }"
      />
      <EaSelectInput multiple source="roles" reference="roles" item-text="name" item-value="id" />
      <EaTransferInput source="authorities" reference="authorities" :fetch-filter="authoritiesFetchFilter" />
    </EaForm>
  </EaActionWrapper>
</template>

<script>
import employees from "./employees"

export default {
  mixins: [employees],
}
</script>

<style scoped></style>
