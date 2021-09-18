import get from "lodash/get";

export default {
  inject: {
    formState: { default: undefined },
  },
  props: {
    required: Boolean,
    rules: {
      type: Array,
      default() {
        let rules = [];

        if (this.required) {
          rules.push(v => !!v || this.$t("em.hints.required", { field: this.inputLabel }));
        }
        return rules;
      },
    },
    parentSource: String,
    source: String,
    model: String,
    label: String,
    index: Number,
    readonly: Boolean,
    errorMessages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      input: null,
      internalErrorMessages: [],
    };
  },
  watch: {
    value: {
      handler(val) {
        this.input = val;
      },
      immediate: true,
    },
    formState: {
      handler(val) {
        if (val) {
          this.update(
              this.getItem(get(val.item || val.model, this.uniqueSourceId))
          );
        }
      },
      immediate: true,
    },
    "formState.item"(val) {
      this.update(
          this.getItem(get(val || this.formState.model, this.uniqueSourceId))
      );
    },
    "formState.errors"(val) {
      if (val) {
        this.internalErrorMessages = val[this.uniqueFormId] || [];
      }
    },
  },
  computed: {
    inputLabel() {
      if (this.label) {
        return this.label;
      }

      if (!this.source) {
        return "";
      }

      let source = this.source;
      if (this.parentSource) {
        source = `${this.parentSource}.${this.source}`;
      }

      return this["$admin"].getFieldLabel(this.formState.resource, source);
    },
    uniqueSourceId() {
      return [this.parentSource, this.index, this.source]
          .filter((s) => s !== undefined)
          .join(".");
    },
    uniqueFormId() {
      return [this.parentSource, this.index, this.model || this.source]
          .filter((s) => s !== undefined)
          .join(".");
    },
    commonProps() {
      return {
        label: this.inputLabel,
        value: this.input,
        rules: this.rules,
        errorMessages: [...this.errorMessages, ...this.internalErrorMessages],
        readonly: this.readonly || this.formState.readonly,
        hint: (this.readonly || this.formState.readonly) ? this.$t('em.hints.readonly', {field: "*"}) : null
    };
    },
  },
  methods: {
    getItem(value) {
      return value === undefined ? this.value : value;
    },
    change(value) {
      this.$emit("change", value);
    },
    update(value) {
      if (this.formState) {
        this.formState.update({
          source: this.uniqueFormId,
          value,
        });
      }

      this.input = value;
      this.$emit("input", value);
    },
  },
}
