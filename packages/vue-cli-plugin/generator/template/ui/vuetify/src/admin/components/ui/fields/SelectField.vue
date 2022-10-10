<template>
  <v-sheet class="selected-chips">
    <v-chip small outlined v-for="(item, index) in selected" :key="index">{{ item[itemText] }}</v-chip>
  </v-sheet>
</template>

<script>
import Input from "@lowcoder66/easy-admin/src/mixins/input"
import Select from "@lowcoder66/easy-admin/src/mixins/select"
import Reference from "@lowcoder66/easy-admin/src/mixins/reference"

export default {
  mixins: [Input, Select, Reference],
  props: {
    chip: Boolean,
    value: [String, Array],
  },
  async created() {
    if (this.reference) {
      this.options = this.referenceData
    }
  },
  computed: {
    selected() {
      return this.value instanceof Array
        ? (this.options || this.enums).filter((item) => (this.value || []).includes(item[this.itemValue]))
        : (this.options || this.enums).filter((item) => item[this.itemValue] === this.value) || []
    },
  },
  watch: {
    referenceData(val) {
      if (val && this.reference) {
        this.options = val
      }
    },
  },
}
</script>

<style scoped lang="sass">
@import '~vuetify/src/styles/styles.sass'

.selected-chips
  background-color: transparent

  .v-chip
    margin-right: $spacer
</style>
