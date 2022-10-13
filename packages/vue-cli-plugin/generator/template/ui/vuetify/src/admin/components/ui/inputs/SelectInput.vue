<template>
  <v-select
    v-bind="{ ...$attrs, ...commonProps }"
    :chips="chip"
    :multiple="multiple"
    :item-text="itemText"
    :item-value="itemValue"
    :items="options || enums"
    :loading="loading"
    @change="change"
    @input="update"
  >
    <template v-if="multiple && maxShowCount" v-slot:selection="{ item, index }">
      <template v-if="index <= maxShowCount - 1">
        <v-chip v-if="chip">
          <span>{{ getItemText(item) + ", " }}</span>
        </v-chip>
        <span v-else>{{ getItemText(item) + ", " }}</span>
      </template>

      <span v-if="index === maxShowCount" class="grey--text text-caption">
        (+{{ value.length - maxShowCount }} {{ $i18n.te("ea.select.others") ? $i18n.t("ea.select.others") : "others" }})
      </span>
    </template>
  </v-select>
</template>

<script>
import Input from "@lowcoder66/easy-admin/src/mixins/input"
import Multiple from "@lowcoder66/easy-admin/src/mixins/multiple"
import Select from "@lowcoder66/easy-admin/src/mixins/select"
import Reference from "@lowcoder66/easy-admin/src/mixins/reference"

export default {
  mixins: [Input, Multiple, Select, Reference],
  props: {
    chip: {
      type: Boolean,
      default() {
        return true
      },
    },
    maxShowCount: {
      type: Number,
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
  methods: {
    getItemText(item) {
      if (item) {
        if (typeof item === "string") {
          return item
        }
        if (this.itemText instanceof Function) {
          return this.itemText(item)
        }
        if (typeof this.itemText === "string") {
          return item[this.itemText]
        }
      }
      return item
    },
  },
}
</script>
