import get from "lodash/get"

export default {
  inject: {
    formState: { default: undefined },
  },
  props: {
    required: Boolean,
    rules: {
      type: Array,
      default() {
        let rules = []

        if (this.required) {
          rules.push((v) => {
            let hasVal
            if (typeof v === "undefined" || v === null) {
              hasVal = false
            } else if (typeof v === "boolean" || typeof v === "number") {
              hasVal = true
            } else {
              hasVal = !!v
            }
            return hasVal || this.$t("ea.hints.required", { field: this.inputLabel })
          })
        }
        return rules
      },
    },
    parentSource: String,
    source: String,
    model: String,
    label: String,
    index: Number,
    readonly: Boolean,
    hideHint: {
      type: Boolean,
      default: false,
    },
    errorMessages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: null,
      internalErrorMessages: [],
    }
  },
  watch: {
    value: {
      handler(val) {
        this.input = val
      },
      immediate: true,
    },
    formState: {
      handler(val) {
        if (val) {
          this.update(this.getItem(get(val.item || val.model, this.uniqueSourceId)))
        }
      },
      immediate: true,
    },
    "formState.item"(val) {
      this.update(this.getItem(get(val || this.formState.model, this.uniqueSourceId)))
    },
    "formState.errors"(val) {
      if (val) {
        this.internalErrorMessages = val[this.uniqueFormId] || []
      }
    },
  },
  computed: {
    inputLabel() {
      if (this.label) {
        return this.label
      }

      if (!this.source) {
        return ""
      }

      let source = this.source
      if (this.parentSource) {
        source = `${this.parentSource}.${this.source}`
      }

      let label = this.formState ? this["$admin"].getFieldLabel(this.formState.resource, source) : null
      if (this.required) {
        return `* ${label}`
      } else {
        return label
      }
    },
    uniqueSourceId() {
      return [this.parentSource, this.index, this.source].filter((s) => s !== undefined).join(".")
    },
    uniqueFormId() {
      return [this.parentSource, this.index, this.model || this.source].filter((s) => s !== undefined).join(".")
    },
    readonlyInput() {
      return this.readonly || (this.formState && this.formState.readonly)
    },
    readonlyHint() {
      return this.readonlyInput && !this.hideHint ? this.$t("ea.hints.readonly", { field: "*" }) : null
    },
    commonProps() {
      return {
        label: this.inputLabel,
        value: this.input,
        rules: this.rules,
        errorMessages: [...this.errorMessages, ...this.internalErrorMessages],
        readonly: this.readonlyInput,
        hint: this.readonlyHint,
      }
    },
  },
  methods: {
    getItem(value) {
      return value === undefined ? this.value : value
    },
    change(value) {
      this.$emit("change", value)
    },
    update(value) {
      if (this.formState) {
        this.formState.update({
          source: this.uniqueFormId,
          value,
        })
      }

      this.input = value
      this.$emit("input", value)
    },
  },
}
