<template>
  <List :resource="resource" :action="action" :title="title" :fields="fields" />
</template>

<script>
import { guessFields } from "@lowcoder/easy-admin/src/utils/guesser"
import List from "../ui/retrieve-layout/List"

export default {
  components: { List },
  props: ["resource", "title", "action"],
  data() {
    return {
      fields: [],
    }
  },
  async created() {
    this.fields = await guessFields(this.$store, this.$i18n, this.resource.name)
  },
}
</script>
