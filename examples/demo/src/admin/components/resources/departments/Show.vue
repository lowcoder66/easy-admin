<template>
  <ActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <Form
      readonly
      :id="id"
      :value="newItem"
      :resource="resource.name"
      @saved="handleFormSaved"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <ea-text-input required source="name" />
      <ea-select-input source="parent" model="parentId" :items="[newItem]" item-text="name" item-value="id" readonly />
    </Form>
  </ActionWrapper>
</template>

<script>
import Form from "../../ui/Form"
import ActionWrapper from "../../ui/ActionWrapper"

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
  components: { ActionWrapper, Form },
  data() {
    return {
      newItem: {
        ...this.item,
        parent: this.item && this.item.parentId,
      },
    }
  },
  async created() {},
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
