<template>
  <EaList :resource="resource" :action="action" :title="title" :fields="fields" />
</template>

<script>
export default {
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [
        { source: "applicationKeyword", hide: true, filterable: true },
        { source: "application", sortable: true },
        { source: "profile", sortable: true, filterable: true, type: "select", enumKey: "profiles" },
        { source: "label", sortable: true, filterable: true },
        { source: "key", sortable: true },
        { source: "value", sortable: true },
        { source: "createdTime", sortable: true, type: "dateTime" },
        { source: "lastModifiedTime", sortable: true, type: "dateTime" },
        { source: "keyKeyword", hide: true, filterable: true },
        { source: "valueKeyword", hide: true, filterable: true },
      ],
    }
  },
}
</script>
