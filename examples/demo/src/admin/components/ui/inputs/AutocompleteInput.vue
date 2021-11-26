<template>
  <v-autocomplete
    v-bind="{ ...$attrs, ...commonProps }"
    chips
    :multiple="multiple"
    :item-text="itemText"
    :item-value="itemValue"
    :items="selectItems"
    :loading="loading"
    :filter="filter"
    @change="change"
    @input="inputUpdate"
    :search-input.sync="searchInput"
  >
  </v-autocomplete>
</template>

<script>
import Input from "@lowcoder/easy-admin/src/mixins/input"
import Multiple from "@lowcoder/easy-admin/src/mixins/multiple"
import Select from "@lowcoder/easy-admin/src/mixins/select"
import Reference from "@lowcoder/easy-admin/src/mixins/reference"

export default {
  mixins: [Input, Multiple, Select, Reference],
  async created() {
    if (this.reference) {
      this.options = this.referenceData
    }
  },
  watch: {
    referenceData(val) {
      if (val && this.reference) {
        this.options = val
      }
    },
  },
  data() {
    return {
      searchInput: null,
      searchItemsCache: [],
    }
  },
  computed: {
    selectItems() {
      let searchInputItem = this.searchInput ? [{ text: this.searchInput, value: this.searchInput }] : []
      return searchInputItem.concat(this.options || this.enums).concat(this.searchItemsCache)
    },
  },
  methods: {
    filter(item, queryText, itemText) {
      return itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1
    },
    inputUpdate(value) {
      if (value) {
        if (
          this.multiple &&
          value.some((i) => i === this.searchInput) &&
          !this.searchItemsCache.includes(this.searchInput)
        ) {
          this.searchItemsCache.push(this.searchInput)
        } else if (value === this.searchInput && !this.searchItemsCache.includes(this.searchInput)) {
          this.searchItemsCache.push(this.searchInput)
        }
      }

      this.update(value)
    },
  },
}
</script>
