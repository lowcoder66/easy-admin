<template>
  <div v-if="messages && messages.length > 0" class="d-flex justify-center">
    <template v-if="expand">
      <v-alert
        dense
        elevation="2"
        colored-border
        border="left"
        class="app-messages mt-4 expanded"
        :type="messages[0].type"
        :style="{ maxWidth: $vuetify.breakpoint.xs ? '100%' : '40%' }"
      >
        <span slot="prepend" />
        <div class="multiple-messages">
          <v-alert dense v-for="(a, index) in messages" :key="index" :type="a.type">
            <span>{{ a.message }}</span>
            <v-btn small icon slot="close" @click="handleCloseMessage(a)">
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </v-alert>
        </div>
        <v-btn class="ml-4" slot="append" icon @click="expand = false">
          <v-icon>mdi-unfold-less-horizontal</v-icon>
        </v-btn>
      </v-alert>
    </template>
    <template v-else>
      <v-alert
        dense
        elevation="2"
        class="app-messages mt-4"
        :type="messages[0].type"
        :style="{ maxWidth: $vuetify.breakpoint.xs ? '100%' : '30%' }"
      >
        <span>{{ messages[0].message }}</span>
        <v-btn v-if="messages.length > 1" slot="append" small class="ml-4" icon @click="expand = true">
          <v-icon>mdi-unfold-more-horizontal</v-icon>
        </v-btn>
        <v-btn
          v-if="messages.length === 1"
          slot="close"
          small
          class="ml-4"
          icon
          @click="handleCloseMessage(messages[0])"
        >
          <v-icon>mdi-close-circle</v-icon>
        </v-btn>
      </v-alert>
    </template>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex"

export default {
  data() {
    return {
      expand: false,
      clearTimer: null,
      step: 500,
    }
  },
  computed: {
    ...mapState("app", {
      messages: "messages",
    }),
  },
  watch: {
    messages(val) {
      if (val) {
        this.addClearTimer()
      } else {
        this.removeClearTimer()
      }

      if (val.length === 1) {
        this.expand = false
      }
    },
    expand(val) {
      if (val) {
        this.removeClearTimer()
      } else {
        this.addClearTimer()
      }
    },
  },
  methods: {
    ...mapMutations("app", ["delMessage"]),
    handleCloseMessage(msg) {
      this.delMessage(msg.uid)
    },
    addClearTimer() {
      if (this.messages && !this.clearTimer && !this.expand) {
        let v = this
        this.clearTimer = setInterval(() => {
          if (v.messages.length === 0) {
            v.removeClearTimer()
          } else {
            this.messages
              .filter((a) => a.live >= 0)
              .forEach((a) => {
                a.live -= this.step
                if (a.live <= 0) {
                  this.handleCloseMessage(a)
                }
              })
          }
        }, this.step)
      }
    },
    removeClearTimer() {
      if (this.clearTimer) {
        clearInterval(this.clearTimer)
        this.clearTimer = null
      }
    },
  },
  destroyed() {
    this.removeClearTimer()
  },
  created() {
    this.addClearTimer()
  },
}
</script>

<style scoped>
.app-messages {
  position: absolute;
  z-index: 999;
}
.multiple-messages {
  overflow-y: auto;
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  max-height: 300px;
}
.multiple-messages::-webkit-scrollbar {
  width: 0 !important;
}
</style>
