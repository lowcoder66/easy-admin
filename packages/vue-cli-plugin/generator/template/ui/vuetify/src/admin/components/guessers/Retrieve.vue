<template>
  <EaList :resource="resource" :action="action" :title="title" :fields="fields" />
</template>

<script>
import { guessInputs } from "@lowcoder66/easy-admin/src/utils/guesser"

export default {
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
