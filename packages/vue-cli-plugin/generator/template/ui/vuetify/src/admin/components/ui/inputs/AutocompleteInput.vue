<template>
  <v-autocomplete
    v-bind="{ ...$attrs, ...commonProps }"
    :chips="chip"
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
    <template v-slot:selection="data">
      <v-chip v-if="chip" v-bind="data.attrs" :input-value="data.selected" @click="data.select">
        {{ labelMode ? data.item[itemValue] : data.item[itemText] }}
      </v-chip>
      <span v-else>
        {{ labelMode ? data.item[itemValue] : data.item[itemText] }}
      </span>
    </template>
    <template v-slot:item="data">
      <template v-if="!labelMode || typeof data.item !== 'object'">
        <v-list-item-content>{{ data.item[itemText] }}</v-list-item-content>
      </template>
      <template v-else>
        <v-list-item-content>
          <v-list-item-title>{{ data.item[itemValue] }}</v-list-item-title>
          <v-list-item-subtitle>{{ data.item[itemText] }}</v-list-item-subtitle>
        </v-list-item-content>
      </template>
    </template>
  </v-autocomplete>
</template>

<script>
import Input from "@lowcoder66/easy-admin/src/mixins/input"
import Multiple from "@lowcoder66/easy-admin/src/mixins/multiple"
import Select from "@lowcoder66/easy-admin/src/mixins/select"
import Reference from "@lowcoder66/easy-admin/src/mixins/reference"

export default {
  mixins: [Input, Multiple, Select, Reference],
  props: {
    labelMode: {
      type: Boolean,
      default() {
        return false
      },
    },
    chip: {
      type: Boolean,
      default() {
        return true
      },
    },
  },
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
      let searchInputItem = []
      if (this.searchInput) {
        let item = {}
        item[this.itemText] = this.searchInput
        item[this.itemValue] = this.searchInput
        searchInputItem.push(item)
      }
      return searchInputItem.concat(this.options || this.enums).concat(this.searchItemsCache)
    },
  },
  methods: {
    filter(item, queryText, itemText) {
      let itemValue = item[this.itemValue]
      return (
        (itemValue && itemValue.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1) ||
        (itemText && itemText.toLocaleLowerCase().indexOf(queryText.toLocaleLowerCase()) > -1)
      )
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
