<template>
  <v-card outlined>
    <v-card-title class="grey lighten-3 pa-2 body-2">
      <v-checkbox
        @change="handleCheckAllChange"
        :value="checkAll"
        :indeterminate="checkAllIndeterminate"
        dense
        hide-details
        class="ma-0 pa-0"
      />
      <span>{{ label || $t("em.transfer.label") }}</span>
      <v-spacer />
      <span>{{ selectedItems.length }}/{{ items.length }}</span>
    </v-card-title>
    <v-card-text class="pa-0">
      <div v-if="filterable" class="px-2">
        <v-text-field
          flat
          dense
          clearable
          hide-details
          :placeholder="$t('em.transfer.filter_placeholder')"
          class="py-0"
          v-model="filter"
        >
          <template v-slot:append-outer>
            <span class="body-2" style="line-height: 26px">{{ filteredItems.length }}</span>
          </template>
        </v-text-field>
      </div>
      <v-list dense flat height="250" class="overflow-y-auto">
        <v-list-item-group multiple v-model="itemGroupSelected">
          <v-list-item v-for="item in filteredItems" :key="item[valueKey]" class="px-2" :value="item[valueKey]">
            <template v-slot:default="{ active }">
              <v-list-item-action class="mr-2">
                <v-checkbox dense :input-value="active" />
              </v-list-item-action>

              <v-list-item-content class="pa-0">
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-title v-bind="attrs" v-on="on" v-if="titleKey">{{ item[titleKey] }}</v-list-item-title>
                  </template>
                  <span>{{ item[titleKey] }}</span>
                </v-tooltip>
                <v-tooltip bottom open-delay="500">
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle v-bind="attrs" v-on="on" v-if="subTitleKey">
                      {{ item[subTitleKey] }}
                    </v-list-item-subtitle>
                  </template>
                  <span>{{ item[subTitleKey] }}</span>
                </v-tooltip>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    filterable: {
      type: Boolean,
      default: true,
    },
    label: String,
    titleKey: String,
    subTitleKey: String,
    valueKey: {
      type: String,
      default: "id",
    },
    items: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      filter: null,
      checkAll: false,
    }
  },
  computed: {
    filteredItems() {
      let filter = this.filter && this.filter.trim()
      if (filter) {
        return this.items.filter((i) => i[this.titleKey].includes(filter) || i[this.subTitleKey].includes(filter))
      }

      return this.items
    },
    filteredItemsIds() {
      return this.filteredItems.map((i) => i[this.valueKey])
    },
    filteredSelectedItems() {
      return this.filteredItemsIds.filter((i) => this.selectedItems.includes(i))
    },
    checkAllIndeterminate() {
      return this.filteredSelectedItems.length > 0 && this.filteredSelectedItems.length !== this.filteredItems.length
    },
    itemGroupSelected: {
      get() {
        return this.selectedItems.filter((si) => this.filteredItemsIds.includes(si))
      },
      set(value) {
        this.selectedItems = this.selectedItems.filter((si) => !this.filteredItemsIds.includes(si)).concat(value)
      },
    },
    selectedItems: {
      get() {
        return this.selected
      },
      set(value) {
        this.$emit("update:selected", value)
      },
    },
  },
  watch: {
    filteredSelectedItems(value) {
      this.checkAll = this.filteredItems && value.length === this.filteredItems.length
    },
    selected(value) {
      this.$emit("update:selected", value)
    },
  },
  methods: {
    handleCheckAllChange(value) {
      let otherSelected = this.selectedItems.filter((si) => !this.filteredItemsIds.includes(si))
      if (value) {
        this.selectedItems = otherSelected.concat(this.filteredItemsIds)
      } else {
        this.selectedItems = otherSelected
      }
    },
  },
}
</script>

<style scoped></style>
