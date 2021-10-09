<template>
  <v-dialog persistent v-if="needConfirm" v-model="confirmDialog" max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-if="actionKey && $admin.hasActionPermission(resource, actionKey)"
        v-bind="{ ...$attrs, ...attrs }"
        v-on="on"
        :small="small"
        :icon="icon"
        :color="color || 'red'"
      >
        <v-icon :small="small" :left="!icon">{{ btnIcon || "mdi-delete" }}</v-icon>
        <span v-if="!icon">{{ btnLabel || actionLabel }}</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h3>{{ confirmTitle }}</h3>
      </v-card-title>
      <v-card-text>{{ confirmMessage }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="info" text @click.native="confirmNo">{{ $t("em.confirm.no") }}</v-btn>
        <ActionButton
          text
          :resource="resource"
          :loading="deleting"
          :icon="false"
          color="red"
          :label="$t('em.confirm.yes')"
          :action-key="actionKey"
          :id="id"
          :item="item"
          @click="onDelete"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ActionButton
    v-else
    v-bind="$attrs"
    :small="small"
    :resource="resource"
    :icon="icon"
    :loading="deleting"
    :btn-icon="btnIcon || 'mdi-trash-can'"
    :color="color || 'red'"
    :label="label"
    :btn-label="btnLabel"
    :action-key="actionKey"
    :id="id"
    :item="item"
    @click="onDelete"
  />
</template>

<script>
import ActionButton from "./ActionButton"
import Button from "../../../mixins/button"

export default {
  mixins: [Button],
  components: { ActionButton },
  props: {
    action: {
      type: String,
    },
    icon: {
      type: Boolean,
      default: false,
    },
    item: null,
    id: null,
    needConfirm: {
      type: Boolean,
      default: true,
    },
    small: Boolean,
  },
  computed: {
    actionKey() {
      return "delete" + (this.action ? `=${this.action}` : "")
    },
    confirmTitle() {
      return this.$t("em.confirm.delete_title", {
        resource: this["$admin"].getResourceLabel(this.currentResource, 10),
        label: this["$admin"].getResourceItemLabel(this.currentResource, this.item),
      })
    },
    confirmMessage() {
      return this.$t("em.confirm.delete_message", {
        resource: this["$admin"].getResourceLabel(this.currentResource, 10),
        label: this["$admin"].getResourceItemLabel(this.currentResource, this.item),
      })
    },
    actionLabel() {
      return this.label || this["$admin"].getActionLabel(this.resource, this.actionKey)
    },
  },
  data() {
    return {
      confirmDialog: false,
      deleting: false,
    }
  },
  methods: {
    confirmNo() {
      this.confirmDialog = false
      this.$emit("action-canceled")
    },
    async onDelete() {
      this.deleting = true
      try {
        const resId = this.id || this.item.id
        await this.$store.dispatch(`${this.resource}/delete`, {
          id: resId,
        })

        this.$emit("action-completed")
      } finally {
        this.deleting = false
      }
    },
  },
}
</script>

<style scoped></style>
