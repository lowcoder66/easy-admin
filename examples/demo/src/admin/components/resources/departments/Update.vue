<template>
  <ActionWrapper
      :title="title"
      :resource="resource.name"
      :display-mode="displayMode"
      @cancel="onCancelAction"
  >
    <Form :value="item"
          :id="id"
          :resource="resource.name"
          @saved="handleFormSaved"
          :redirect="displayMode === 'page' ? 'retrieve' : false">
        <ea-text-input required source="name" />
        <ea-select-input source="parent"
                         model="parentId"
                         reference="departments"
                         item-text="name"
                         item-value="id"
                         :fetch-filter="{all: true}" />
    </Form>
  </ActionWrapper>
</template>

<script>
import Form from "../../ui/Form"
import ActionWrapper from "../../ui/ActionWrapper"

export default {
  components: {ActionWrapper, Form},
  props: {
    title: String,
    resource: Object,
    item: Object,
    id: {
      type: [String, Number]
    },
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer", ].includes(v),
      default: "page",
    }
  },
  data() {
    return {
    };
  },
  async created() {
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

<style scoped>

</style>
