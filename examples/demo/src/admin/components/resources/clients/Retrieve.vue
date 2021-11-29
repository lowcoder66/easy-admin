<template>
  <EaList :resource="resource" :action="action" :title="title" :fields="fields" />
</template>

<script>
export default {
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [
        "clientId",
        "clientName",
        "clientSecret",
        { source: "grantTypes", type: "select" },
        "scopes",
        { source: "searchKeyword", model: "keyword", filterable: true, hide: true },
      ],
    }
  },
}
</script>
