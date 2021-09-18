<template>
  <div class="d-flex justify-center mx-auto" >
    <v-card width="400" class="pa-4">
      <v-card-text>
        <auth-head :input-email="form.username" />

        <v-form ref="form" >
          <v-text-field
              clearable
              label="账户"
              prepend-icon="mdi-account"
              v-model="form.username"
              :rules="[v => !!v || '账户（邮箱）必填']"
              required
          ></v-text-field>

          <v-row>
            <v-col cols="21">
              <v-text-field
                  clearable
                  label="随机码"
                  prepend-icon="mdi-email-lock"
                  v-model="form.code"
                  :rules="[v => !!v || '从邮件中获取随机代码']"
                  required
              >
              </v-text-field>
            </v-col>
            <v-col cols="3" align-self="center">
              <a slot="append-outer" class="text-body-2" @click="handleSendEmail" >{{ emailSent ? '再次发送' : '发送邮件'}}</a>
            </v-col>
          </v-row>

          <v-text-field
              clearable
              label="密码"
              prepend-icon="mdi-lock"
              v-model="form.password"
              type="password"
              :rules="[v => !!v || '输入新的密码']"
              required
          ></v-text-field>

          <v-text-field
              clearable
              label="确认密码"
              prepend-icon="mdi-content-copy"
              v-model="form.confirmPassword"
              type="password"
              :rules="[v => !!v || '再次输入密码', v => v === form.password || '两次输入密码不一致']"
              required
          ></v-text-field>

          <div class="text-left text-body-2 mt-4">
            <router-link :to="{ name: 'login' }">
              &lt; 密码登录
            </router-link>
          </div>

          <div class="actions mt-4">
            <v-btn color="primary" block @click="submit">重置</v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import {mapState} from "vuex"
import AuthHead from "./AuthHead"

export default {
  name: "ForgotPassword",
  components: {AuthHead},
  data() {
    return {
      form: {
        username: null,
        code: null,
        password: null,
        confirmPassword: null,
      },
      emailSent: false,
    }
  },
  methods: {
    handleSendEmail() {

    },
    submit() {

    }
  },
  computed: {
    ...mapState({
      email: state => state.user.email,
    }),
  },
  created() {
    this.form.username = this.email
  },

}
</script>

<style scoped>

</style>
