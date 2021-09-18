<template>
  <div class="d-flex justify-center mx-auto" >
    <v-card width="400" class="pa-4">
      <v-card-text>
        <auth-head :input-email="form.username" />

        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
              clearable
              label="账户"
              prepend-icon="mdi-account"
              v-model="form.username"
              :rules="[v => !!v || '账户必填']"
              required
          ></v-text-field>

          <v-text-field
              clearable
              label="密码"
              prepend-icon="mdi-lock"
              type="password"
              v-model="form.password"
              :rules="[v => !!v || '密码必填']"
              required
          ></v-text-field>

          <div class="text-right text-body-2 mt-4">
            <router-link :to="{ name: 'forgotPassword' }">
              忘记密码 &gt;
            </router-link>
          </div>

          <div class="actions mt-4">
            <v-btn color="primary" block type="submit" >登录</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {mapActions} from "vuex"
import AuthHead from "./AuthHead"

export default {
  name: "Login",
  components: {AuthHead},
  methods: {
    ...mapActions("auth", {
      login: "login"
    }),
    async submit() {
      if (this.$refs.form.validate()) {
        await this.login(this.form);
      }
    }
  },
  computed: {
  },
  created() {
  },
  data() {
    return {
      form: {
        username: null,
        password: null,
      }
    }
  }
}
</script>

<style scoped>

</style>
