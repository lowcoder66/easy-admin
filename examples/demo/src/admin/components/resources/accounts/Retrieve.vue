<template>
  <EaList :resource="resource" :action="action" :title="title" :fields="fields">
    <template #rowActions="{ row, resource, fetchData }">
      <EaActionButton
        action-key="operate=updateAuthorities"
        :resource="resource"
        :id="row.id"
        :item="row"
        btn-icon="mdi-shield-plus-outline"
        :label="$admin.getFieldLabel(resource, 'authorities')"
        small
        outlined
        @action-completed="fetchData"
      />
      <EaActionButton
        action-key="operate=updateStatus"
        :resource="resource"
        :id="row.id"
        :item="row"
        :btn-icon="row.enabled ? 'mdi-account-off' : 'mdi-account-outline'"
        :label="$t(`ea.actions.${row.enabled ? 'disable' : 'enable'}`)"
        :color="row.enabled ? 'red' : 'green'"
        small
        outlined
        @click="updateStatus(row, fetchData)"
      />
    </template>
  </EaList>
</template>

<script>
export default {
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [
        { source: "name", sortable: true },
        { source: "phone", sortable: true },
        { source: "email", sortable: true },
        { source: "registerTime", type: "dateTime", sortable: true },
        { source: "enabled", type: "boolean", sortable: true },
        { source: "searchKeyword", model: "keyword", filterable: true, hide: true },
      ],
    }
  },
  methods: {
    updateStatus(row, fetchData) {
      let { name, api } = this.resource
      let url = api || name
      if (row.id) {
        url += `/${row.id}`
      }
      url += `?op=updateStatus`

      this.$admin.dataProvider.http.post(url, { enabled: !row.enabled }).then(() => {
        fetchData()
      })
    },
  },
}
</script>
