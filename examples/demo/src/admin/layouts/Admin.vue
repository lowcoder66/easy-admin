<template>
  <v-app>
    <Loading />
    <Messages />

    <v-navigation-drawer app v-model="showNavDrawer">
      <v-list slot="prepend" class="py-1">
        <v-list-item class="px-4">
          <v-list-item-avatar tile>
            <img alt="app-logo" src="@/assets/logo.svg" width="80" height="80"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span class="title primary--text">{{ title }}</span>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <div>
        <v-list nav>
          <v-list-item-group color="primary" mandatory>
            <template v-for="(item, index) in navs" >
              <!-- 分割线或者文字 -->
              <template v-if="item.divider">
                <v-divider v-if="item.divider === 'line'" :key="index" class="pa-1 mt-2 "></v-divider>
                <div v-else-if="item.divider === 'text'" :key="index" class="pa-1 mt-2 overline">{{ item.content }}</div>
              </template>

              <!-- 有子菜单 -->
              <template v-else-if="item.children && item.children.length">
                <v-expansion-panels class="expansion-nav-item" focusabl flat hover accordion :key="index">
                  <v-expansion-panel>
                    <v-expansion-panel-header class="px-2 py-4">
                      <div class="d-flex align-center">
                        <v-icon v-text="item.icon" class="align-self-start mr-8"></v-icon>
                        <span>{{ item.text }}</span>
                      </div>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content class="align-center">
                      <v-list-item dense color="primary" v-for="(c, i) in item.children" :key="`${index}_${i}`" :to="c.link">
                        <v-list-item-icon>
                          <v-icon v-text="c.icon"></v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title v-text="c.text"></v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>
              </template>

              <!-- 独立菜单 -->
              <v-list-item v-else :key="index" :to="item.link">
                <v-list-item-icon>
                  <v-icon v-text="item.icon"></v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="item.text"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list-item-group>
        </v-list>

      </div>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-app-bar-nav-icon @click="handleClickNavIcon"></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height pa-6 grey lighten-4 flex-column align-start">
        <v-breadcrumbs class="pt-0 pb-4 px-0" :items="breadcrumbs">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item :href="item.href" :to="item.to" :disabled="item.disabled">
              <v-icon size="14" class="mr-2" >{{ item.icon }}</v-icon>
              <span>{{ item.text }}</span>
            </v-breadcrumbs-item>
          </template>
        </v-breadcrumbs>

        <router-view />
      </v-container>
    </v-main>

  </v-app>
</template>

<script>
import {mapMutations, mapState} from "vuex"
import navigations from "../../admin/navigations"
import Loading from "./Loading"
import Messages from "./Messages"

export default {
  components: {Loading, Messages},
  data: () => ({
    breadcrumbs: [],
  }),
  watch: {
    '$route'(val) {
      this.buildBreadcrumbs(val)
    }
  },
  created() {
    this.buildBreadcrumbs(this.$route)
  },
  computed: {
    title() {
      return "Title"
    },
    ...mapState('app', {
      navDrawer: "navDrawer",
    }),
    showNavDrawer: {
      get() {
        return this.navDrawer;
      },
      set(value) {
        this.setNavDrawer(value)
      }
    },
    navs() {
      return navigations(this.$i18n, this.$admin)
    },
    indexBreadcrumb() {
      let r = this.$router.match("/")
      let b =  {
        to: '/',
        text: '首页',
        icon: 'mdi-view-dashboard-outline',
        disabled: false,
      }
      if (r) {
        b = this.routeToBreadcrumb(r)
        b.text = "首页"
      }

      return b
    }
  },
  methods: {
    ...mapMutations('app', ["setNavDrawer"]),
    handleClickNavIcon() {
      this.setNavDrawer(!this.navDrawer)
    },
    buildBreadcrumbs(route) {
      let breadcrumbs = [this.indexBreadcrumb]

      // 目前只考虑两层
      if (route && route.path !== this.indexBreadcrumb.to) {
        breadcrumbs.push(this.routeToBreadcrumb(route))
      }

      this.breadcrumbs = breadcrumbs
    },
    routeToBreadcrumb(route) {
      return {
        text: (route.meta && route.meta.title) || route.name,
        to: route.path,
        icon: (route.meta && route.meta.icon) || 'mdi-menu-open',
        disabled: false,
      }
    }
  },
}
</script>

<style scoped>
.expansion-nav-item .v-expansion-panel-header {
  min-height: 56px;
}
.expansion-nav-item >>> .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
.expansion-nav-item .v-list-item {
  margin-bottom: 0 !important;
  padding-left: 32px !important;
}
</style>
