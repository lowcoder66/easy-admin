<template>
  <v-card class="align-self-center" :class="inPage ? 'pa-4' : ''">
    <v-card-title>
      <component :is="inPage ? 'h2' : 'h3'">{{ title }}</component>
      <v-spacer />
      <EaRetrieveButton :resource="resource" v-if="inPage" outlined />
      <v-btn v-else-if="displayMode === 'dialog'" icon @click="onClickClose">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>
    <v-divider />
    <v-card-text class="py-4" :style="`height: ${$vuetify.breakpoint.height * 0.7}px`">
      <slot></slot>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer></v-spacer>
      <EaResetButton text />
      <EaSaveButton text />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    title: String,
    resource: String,
    displayMode: {
      type: String,
      validator: (v) => ["page", "dialog", "drawer"].includes(v),
      default: "page",
    },
  },
  provide() {
    return {
      actionState: this.actionState,
    }
  },
  data() {
    return {
      actionState: {
        form: null,
      },
    }
  },
  computed: {
    inPage() {
      return this.displayMode === "page"
    },
  },
  methods: {
    onClickClose() {
      this.$emit("cancel")
    },
  },
}
</script>

<style scoped></style>
