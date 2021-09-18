<template>
  <ActionWrapper
      :title="title"
      :resource="resource.name"
      :display-mode="displayMode"
      @cancel="onCancelAction"
  >
    <Form :value="newItem"
          :resource="resource.name"
          @saved="handleFormSaved"
          :redirect="displayMode === 'page' ? 'retrieve' : false">
      <ea-text-input required source="name" />
      <template v-if="item">
        <ea-select-input source="parent"
                         model="parentId"
                         :items="[item]"
                         item-text="name"
                         item-value="id"
                         readonly
        />
      </template>
      <template v-else>
        <ea-select-input source="parent"
                         model="parentId"
                         reference="departments"
                         item-text="name"
                         item-value="id"
                         :fetch-filter="{all: true}" />
      </template>
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

    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer", ].includes(v),
      default: "page",
    }
  },
  components: {ActionWrapper, Form},
  data() {
    return {
      newItem: {
        parent: this.item && this.item.id,
      },
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
