<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      readonly
      :id="id"
      :value="item"
      :resource="resource.name"
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
      <EaTransferInput source="authorities" reference="authorities" />
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
