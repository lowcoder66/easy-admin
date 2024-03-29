<template>
  <v-form ref="form" @submit.prevent="onSubmit">
    <slot v-bind:model="formState.model" ></slot>
  </v-form>
</template>

<script>
import Resource from "@lowcoder66/easy-admin/src/mixins/resource"
import set from "lodash/set"

export default {
  mixins: [Resource],
  provide() {
    return {
      formState: this.formState,
    }
  },
  inject: {
    actionState: { default: undefined },
  },
  created() {
    if (this.actionState) {
      this.actionState.form = this.formState
    }
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
    postSave: {
      type: Function,
      default: async function (id, model) {
        if (this.currentAction.name === "operate") {
          return await this.$store.dispatch(`${this.resource}/operate`, {
            id: id,
            data: model,
            operateKey: this.currentAction.key,
          })
        } else {
          return id
            ? await this.$store.dispatch(`${this.resource}/update`, {
                id: id,
                data: model,
              })
            : await this.$store.dispatch(`${this.resource}/create`, {
                data: model,
              })
        }
      },
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
          let model = { ...this.formState.model }
          set(model, source, value)

          this.formState.model = model

          this.$emit("input", model)
        },
        submit: () => {
          this.save()
        },
        reset: () => {
          this.reset()
        },
      },
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.formState.item = val
          this.originalValue = val
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
        this.formState.item = { ...this.originalValue }
      })

      this.$emit("reset")
    },
    async save() {
      if (!this.$refs.form.validate()) {
        return
      }

      this.formState.saving = true

      try {
        let res = await this.postSave(this.id, this.formState.model)
        let data = res && res.data

        this.reset()
        this.$emit("saved", data)

        this.afterSave(data ? data.id : null)
      } finally {
        this.formState.saving = false
      }
    },
    afterSave(itemId) {
      if (this.redirect) {
        const toAction = this.currentResource.actions.find((pa) => pa.key === this.redirect)
        let actionLink = this["$admin"].getActionLink(this.resource, toAction) || "index"

        switch (this.redirect) {
          case "retrieve":
            this.$router.push({ name: actionLink })
            break
          case "create":
            this.formState.item = this.originalValue
            this.$router.push({ name: actionLink })
            break
          case "show":
          case "update":
            this.$router.push({
              name: actionLink,
              params: { id: itemId },
            })
            break
          default:
          // do nothing
        }
      }
    },
  },
}
</script>

<style scoped lang="sass"></style>
