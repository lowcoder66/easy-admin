<template>
  <List :resource="resource" :action="action" :title="title" :fields="fields" />
</template>

<script>
import { guessInputs } from "@lowcoder/easy-admin/src/utils/guesser"
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
    this.fields = await guessInputs(this.$store, this.$i18n, this.resource.name)
  },
}
</script>
