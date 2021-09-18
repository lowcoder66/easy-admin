<template>
  <v-data-table v-model="selection"
                :loading="loading"
                :show-select="false"
                item-key="id"
                :headers="headers" :items="items"
                :server-items-length="totalItems"
                @update:page="handlePageUpdate"
                @update:items-per-page="handleItemsPerPageUpdate" >

    <!-- 表头 -->
    <template v-slot:top>
      <v-toolbar class="mb-2" flat :color="selection.length ? 'grey lighten-4' : 'white'" :elevation="selection.length ? 1 : 0"  >
        <v-toolbar-title v-if="!selection.length">
          <h2>{{ title }}</h2>
        </v-toolbar-title>
        <template v-else>
          <v-btn icon @click="selection = []" >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ `已选择 ${selection.length} 项` }}
          </v-toolbar-title>
        </template>

        <v-spacer></v-spacer>

        <div class="data-table-actions">
          <template v-if="selection.length" >
            <slot name="bulk.actions"></slot>
            <v-btn color="error" @click="handleBatchDel" >
              <v-icon left  >mdi-delete</v-icon>
              <span>批量删除</span>
            </v-btn>
          </template>
          <template v-else>
            <slot name="actions"></slot>
            <CreateButton :resource="resource" @action-completed="fetchData" />
          </template>
        </div>
      </v-toolbar>
    </template>

    <!-- 自定义列渲染 -->
    <template v-slot:item.actions="{ item }">
      <div class="data-table-column-actions">
        <ShowButton small outlined
                    :btn-label="$i18n.t('em.actions.show')"
                    :resource="resource"
                    :id="item.id"
                    :item="item" />
        <UpdateButton small outlined
                      :btn-label="$i18n.t('em.actions.update')"
                      :resource="resource"
                      :id="item.id"
                      :item="item"
                      @action-completed="fetchData" />
        <DeleteButton small outlined
                      :btn-label="$i18n.t('em.actions.delete')"
                      :resource="resource"
                      :id="item.id"
                      :item="item"
                      @action-completed="fetchData" />
      </div>
    </template>

  </v-data-table>
</template>

<script>
import Resource from "@lowcoder/easy-admin/src/mixins/resource";
import CreateButton from "@/admin/components/ui/buttons/CreateButton"
import UpdateButton from "@/admin/components/ui/buttons/UpdateButton"
import ShowButton from "@/admin/components/ui/buttons/ShowButton"
import DeleteButton from "@/admin/components/ui/buttons/DeleteButton"

export default {
  components: {DeleteButton, ShowButton, UpdateButton, CreateButton,},
  mixins: [Resource, ],
  props: {
    title: {
      type: String,
      default: "List",
    },
    fields: {
      type: Array,
      default: () => [],
    },
    filter: {
      type: Object,
      default: () => {},
    },
    disableColumnActions: Boolean,
  },
  data() {
    return {
      loading: false,
      selection: [],
      items: [],
      totalItems: 0,
      listParams: {
        sort: [],
        filter: {},
        pagination: {
          page: 1,
          perPage: this.$admin.options.defaultPerPage,
        },
      },
    }
  },
  computed: {
    tableFields() {
      return this.fields
          .map(f => {
            return typeof f === "string" ? { source: f } : f;
          })
          .map(f => {
            return {
              ...f,
              type: f.type,
              label: f.label || this.$admin.getFieldLabel(this.resource, f.labelKey || f.source),
            }
          });
    },
    headers() {
      let fields = this.tableFields.map(field => {
        return {
          text: field.label,
          value: field.source,
          sortable: field.sortable,
          align: field.align || this.smartAlign(field),
        };
      });

      if (!this.disableColumnActions && this.currentResource.actions.some(a => ["retrieve", "create"].indexOf(a.name) === -1)) {
        fields.push({
          text: this.$i18n.t('em.column.actions') || "actions",
          value: "actions",
          sortable: false,
          align: "right",
        });
      }

      return fields
    },
  },
  methods: {
    smartAlign(field) {
      if (["number"].includes(field.type)) {
        return "right";
      }
      return "left";
    },
    handlePageUpdate(page) {
      this.listParams.pagination.page = page
      this.fetchData()
    },
    handleItemsPerPageUpdate(perPage) {
      this.listParams.pagination.perPage = perPage
      this.fetchData()
    },
    async fetchData() {
      this.loading = true
      let {sort, filter, pagination} = this.listParams
      let { data, total } = await this.$store.dispatch(
          `${this.resource}/getList`,
          {
            sort,
            filter: {...filter, ...this.filter},
            pagination,
          }
      );

      this.totalItems = total
      this.items = data
      this.loading = false
    }
  },
  mounted() {
    this.listParams.pagination.perPage = this.$admin.options.defaultPerPage
    this.fetchData()
  },
  watch: {
    filter(val) {
      if (val) {
        this.fetchData()
      }
    },
  }
}
</script>

<style scoped lang="sass">
  @import '~vuetify/src/styles/styles.sass'

  .data-table-column-actions
    ::v-deep button,a
      &:not(a:last-of-type)
        margin-right: $spacer
      &:not(button:last-of-type)
        margin-right: $spacer

  .data-table-actions
    ::v-deep button,a
      &:not(a:last-of-type)
        margin-right: $spacer
      &:not(button:last-of-type)
        margin-right: $spacer
</style>
