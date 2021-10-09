<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :value="item"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="code" required />
      <EaTextInput source="name" required />
      <EaTextInput source="description" multiline />
      <EaTransferInput label="权限" model="authorities" reference="authorities" />
    </EaForm>
  </EaActionWrapper>
</template>

<script>
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
    return {}
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
