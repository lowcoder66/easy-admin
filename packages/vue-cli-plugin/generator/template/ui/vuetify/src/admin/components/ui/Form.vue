<template>
  <v-form ref="form" @submit.prevent="onSubmit" :readonly="this.readonly">
    <slot></slot>
    <div v-if="!readonly" class="form-actions">
      <v-spacer></v-spacer>
      <slot name="actions">
        <ResetButton text />
        <SaveButton text />
      </slot>
    </div>
  </v-form>
</template>

<script>
import Resource from "@lowcoder/easy-admin/src/mixins/resource";
import set from "lodash/set";
import SaveButton from "./buttons/SaveButton"
import ResetButton from "./buttons/ResetButton"

export default {
  components: {ResetButton, SaveButton},
  mixins: [Resource],
  provide() {
    return {
      formState: this.formState,
    };
  },
  props: {
    value: {
      type: Object,
      default: () => {},
    },
    id: [String, Number],
    redirect: {
      type: [String, Boolean],
      validator: (v) => ["retrieve", "create", "show", "update", false].includes(v),
      default: "retrieve",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      originalValue: this.value,
      formState: {
        resource: this.resource,
        readonly: this.readonly,
        saving: false,
        item: {},
        model: {},
        update: ({ source, value }) => {
          let model = { ...this.formState.model };
          set(model, source, value);

          this.formState.model = model;

          this.$emit("input", model);
        },
        submit: () => {
          this.save()
        },
        reset: () => {
          this.reset()
        },
      },
    };
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.formState.item = val;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onSubmit() {
      this.save()
    },
    reset() {
      this.$refs.form.reset()
      this.$nextTick(() => {
        this.formState.item = {...this.originalValue}
      })

      this.$emit("reset");
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return;
      }

      this.formState.saving = true;

      try {
        let { data } = this.id
          ? await this.$store.dispatch(`${this.resource}/update`, {
              id: this.id,
              data: this.formState.model,
            })
          : await this.$store.dispatch(`${this.resource}/create`, {
              data: this.formState.model,
            });

        this.$refs.form.reset()
        this.$emit("saved", data);

        this.afterSave(data ? data.id : null)
      } finally {
        this.formState.saving = false;
      }
    },
    afterSave(itemId) {
      if (this.redirect) {
        const toAction = this.currentResource.actions.find(pa => pa.key === this.redirect)
        let actionLink = this['$admin'].getActionLink(this.resource, toAction) || "index"

        switch (this.redirect) {
          case "retrieve":
            this.$router.push({name: actionLink});
            break;
          case "create":
            this.formState.item = this.originalValue;
            this.$router.push({name: actionLink});
            break;
          case "show":
          case "update":
            this.$router.push({
              name: actionLink,
              params: {id: itemId},
            });
            break;
          default:
            // do nothing
        }
      }
    }
  },
};
</script>


<style scoped lang="sass">
.form-actions
  display: flex

  button,a
    &:not(:last-child)
      margin-right: 8px
</style>
