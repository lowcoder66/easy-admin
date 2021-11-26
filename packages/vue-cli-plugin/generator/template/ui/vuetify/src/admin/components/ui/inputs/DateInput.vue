<template>
  <v-menu :disabled="readonlyInput" v-model="menu" :close-on-content-click="false" offset-overflow min-width="auto">
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        :value="dateFormatted"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="{ ...$attrs, ...commonProps, ...attrs }"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker :value="getDate" @change="change" @input="inputDate"></v-date-picker>
  </v-menu>
</template>

<script>
import Input from "@lowcoder/easy-admin/src/mixins/input"
import { formatDate, parseDate } from "@lowcoder/easy-admin/src/utils/dateUtils"

export default {
  mixins: [Input],
  props: {
    value: {
      type: [String, Number, Date],
    },
    format: {
      type: String,
      default() {
        return this.$admin.options.dateFormat
      },
    },
  },
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    dateFormatted() {
      return this.input ? formatDate(this.input, this.format) : ""
    },
    getDate() {
      let date = parseDate(this.input)
      return date ? formatDate(this.input, "YYYY-MM-DD") : null
    },
  },
  methods: {
    inputDate(val) {
      this.menu = false
      this.update(parseDate(val).getTime())
    },
  },
}
</script>
