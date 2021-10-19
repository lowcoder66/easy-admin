<template>
  <EaList :resource="resource" :action="action" :title="title" :fields="fields" />
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
        { source: "registerTime", sortable: true },
        { source: "enabled", type: "boolean", sortable: true },
        { source: "searchKeyword", model: "keyword", filterable: true, hide: true },
      ],
    }
  },
}
</script>
