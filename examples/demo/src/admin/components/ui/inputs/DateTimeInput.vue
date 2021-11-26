<template>
  <v-row no-gutters>
    <v-col cols="7">
      <v-menu
        :disabled="readonlyInput"
        v-model="dateMenu"
        :close-on-content-click="false"
        offset-overflow
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="dateFormatted"
            prepend-inner-icon="mdi-calendar"
            readonly
            v-bind="{ ...$attrs, ...commonProps, ...attrs }"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker :value="datePart" @change="change" @input="updateDate"></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="5">
      <v-menu
        :disabled="readonlyInput"
        v-model="timeMenu"
        :close-on-content-click="false"
        offset-overflow
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            :value="timeFormatted"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            v-bind="{ ...$attrs, ...commonProps, ...attrs, label: null }"
            v-on="on"
          ></v-text-field>
        </template>
        <v-time-picker
          ampm-in-title
          scrollable
          use-seconds
          format="24hr"
          :value="timePart"
          @change="change"
          @input="updateTime"
        ></v-time-picker>
      </v-menu>
    </v-col>
  </v-row>
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
    dateFormat: {
      type: String,
      default() {
        return this.$admin.options.dateFormat
      },
    },
    timeFormat: {
      type: String,
      default() {
        return this.$admin.options.timeFormat
      },
    },
  },
  data() {
    return {
      dateMenu: false,
      timeMenu: false,
    }
  },
  computed: {
    dateFormatted() {
      return this.input ? formatDate(this.input, this.dateFormat) : ""
    },
    timeFormatted() {
      return this.input ? formatDate(this.input, this.timeFormat) : ""
    },
    datePart() {
      let date = parseDate(this.input)
      return date ? formatDate(this.input, "YYYY-MM-DD") : null
    },
    timePart() {
      let date = parseDate(this.input)
      return date ? formatDate(this.input, "hh:mm:ss") : null
    },
  },
  methods: {
    updateDate(val) {
      this.dateMenu = false
      this.update(parseDate(val + " " + this.timePart).getTime())
    },
    updateTime(val) {
      //this.timeMenu = false
      this.update(parseDate(this.datePart + " " + val).getTime())
    },
  },
}
</script>
