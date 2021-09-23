export default {
  props: {
    resource: {
      type: String,
      default() {
        return this.$route.meta["resource"]
      },
    },
    action: {
      type: String,
      default() {
        return this.$route.meta["action"]
      },
    },
  },
  computed: {
    currentResource() {
      return this["$admin"].getResource(this.resource)
    },
    currentAction() {
      return this["$admin"].getAction(this.resource, this.action)
    },
  },
}
