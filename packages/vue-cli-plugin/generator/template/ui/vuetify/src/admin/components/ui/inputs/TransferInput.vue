<template>
  <div class="pb-8">
    <div class="v-label my-2">{{ inputLabel }}</div>
    <v-row no-gutters>
      <v-col cols="5">
        <EaTransferList
          :readonly="readonlyInput"
          :label="sourceListLabel || $t('em.transfer.source_list')"
          :items="leftItems"
          title-key="code"
          sub-title-key="name"
          :filterable="filterable"
          :selected.sync="leftSelected"
        />
      </v-col>
      <v-col cols="2">
        <div class="fill-height pa-2 d-flex flex-column justify-center">
          <v-btn :disabled="readonlyInput" small depressed class="mt-2" @click="handleClickRight">
            <v-icon>mdi-transfer-right</v-icon>
          </v-btn>
          <v-btn :disabled="readonlyInput" small depressed class="mt-2" @click="handleClickLeft">
            <v-icon>mdi-transfer-left</v-icon>
          </v-btn>
        </div>
      </v-col>
      <v-col cols="5">
        <EaTransferList
          :readonly="readonlyInput"
          :label="sourceListLabel || $t('em.transfer.target_list')"
          :items="rightItems"
          title-key="code"
          sub-title-key="name"
          :filterable="filterable"
          :selected.sync="rightSelected"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Input from "@lowcoder/easy-admin/src/mixins/input"
import Reference from "@lowcoder/easy-admin/src/mixins/reference"
export default {
  mixins: [Input, Reference],
  props: {
    value: {
      type: Array,
      default() {
        return []
      },
    },
    filterable: {
      type: Boolean,
      default: true,
    },
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
    sourceListLabel: String,
    targetListLabel: String,
  },
  data() {
    return {
      listItems: [],
      leftSelected: [],
      rightSelected: [],
    }
  },
  computed: {
    leftItems() {
      return this.listItems.filter((item) => !this.selected.includes(item[this.valueKey]))
    },
    rightItems() {
      return this.listItems.filter((item) => this.selected.includes(item[this.valueKey]))
    },
    selected: {
      get() {
        return this.input
      },
      set(value) {
        this.update(value)
      },
    },
  },
  methods: {
    handleClickRight() {
      this.selected = this.selected.concat(
        this.listItems.map((i) => i[this.valueKey]).filter((v) => this.leftSelected.includes(v))
      )
      this.leftSelected = []
    },
    handleClickLeft() {
      this.selected = this.selected.filter((v) => !this.rightSelected.includes(v))
      this.rightSelected = []
    },
  },
  async created() {
    if (this.reference) {
      this.listItems = this.referenceData
    } else if (this.items) {
      this.listItems = this.items
    }
  },
  watch: {
    referenceData(val) {
      if (val && this.reference) {
        this.listItems = val
      }
    },
  },
}
</script>

<style scoped></style>
