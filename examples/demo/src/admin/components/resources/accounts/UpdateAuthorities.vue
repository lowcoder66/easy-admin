<template>
  <EaActionWrapper :title="title" :resource="resource.name" :display-mode="displayMode" @cancel="onCancelAction">
    <EaForm
      :id="id"
      :value="item"
      :resource="resource.name"
      :action="action.key"
      @saved="handleFormSaved"
      :post-save="saveAuthorities"
      :redirect="displayMode === 'page' ? 'retrieve' : false"
    >
      <EaTextInput source="name" required readonly />
      <EaTextInput source="phone" required readonly />
      <EaAutocompleteInput source="authorities" :items="item['authorities']" multiple />
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
  methods: {
    async saveAuthorities(id, model) {
      let { name, api } = this.resource
      let url = api || name
      if (id) {
        url += `/${id}`
      }
      url += `/authorities`

      return this.$admin.dataProvider.http.post(url, { authorities: model.authorities || [] })
    },
  },
}
</script>

<style scoped></style>
