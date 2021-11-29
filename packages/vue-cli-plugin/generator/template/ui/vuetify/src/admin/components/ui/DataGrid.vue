<template>
  <v-data-table
    v-model="selection"
    :loading="loading"
    :show-select="showSelect"
    item-key="id"
    :headers="headers"
    :items="items"
    :server-items-length="totalItems"
    :multi-sort="multiSort"
    @update:options="handleOptionsUpdate"
  >
    <!-- 表头 -->
    <template v-slot:top>
      <v-toolbar
        class="mb-2"
        flat
        :color="selection.length || filterExpanded ? 'grey lighten-4' : 'white'"
        :elevation="selection.length || filterExpanded ? 1 : 0"
        :extended="filterExpanded"
        :extension-height="filtersExtensionHeight"
      >
        <!-- 展开搜索时的头部 -->
        <template v-if="filterExpanded" #extension>
          <v-sheet
            v-resize="onFiltersWrapperResize"
            ref="filtersWrapper"
            class="filters-wrapper transparent d-flex flex-wrap align-self-start"
            width="100%"
          >
            <slot name="filters" :list-filter="listParams.filter">
              <component
                v-for="(field, index) in filterableFields"
                v-model="listParams.filter[field.model || field.source]"
                :label="field.label"
                :key="index"
                :is="`ea-${field.type}-input`"
                hide-details
              />
            </slot>
          </v-sheet>
        </template>
        <template v-if="filterExpanded">
          <v-btn icon @click="filterExpanded = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ $t("ea.title.actions.filter", { resource: $admin.getResourceLabel(resource) }) }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn color="white" @click="handleResetFilters" class="mr-2">
            <v-icon left>mdi-refresh</v-icon>
            <span>{{ $t("ea.actions.reset") }}</span>
          </v-btn>
          <v-btn color="primary" @click="handleFilter">
            <v-icon left>mdi-filter</v-icon>
            <span>{{ $t("ea.actions.filter") }}</span>
          </v-btn>
        </template>

        <!-- 默认头部 -->
        <template v-else-if="!selection.length">
          <v-toolbar-title>
            <h2>{{ title }}</h2>
          </v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-sheet v-if="singleDisplayFilterField" width="250">
            <v-text-field
              v-model="listParams.filter[singleDisplayFilterField.model || singleDisplayFilterField.source]"
              :label="singleDisplayFilterField.label"
              @keydown="handleFilterFieldKeydown"
              hide-details
              single-line
            >
              <template #append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small v-bind="attrs" v-on="on" @click="handleResetFilters">
                      <v-icon>mdi-refresh</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("ea.list.reset_filter") }}</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon small v-bind="attrs" v-on="on" @click="filterExpanded = true">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <span>{{ $t("ea.list.expand_filter") }}</span>
                </v-tooltip>
              </template>
            </v-text-field>
          </v-sheet>
          <v-spacer />
          <div v-if="!hideActions" class="data-table-actions">
            <slot name="actions"></slot>
            <CreateButton :resource="resource" @action-completed="fetchData" />
          </div>
        </template>

        <!-- 选择时的头部 -->
        <template v-else>
          <v-btn icon @click="selection = []">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>
            {{ `已选择 ${selection.length} 项` }}
          </v-toolbar-title>
          <v-spacer />
          <slot name="bulk.actions" :selection="selection"> </slot>
        </template>
      </v-toolbar>
    </template>

    <!-- 操作列 -->
    <template v-slot:item.actions="{ item }">
      <div class="data-table-row-actions">
        <template v-for="(action, index) in defaultColumnActions">
          <component
            :key="index"
            :is="rowActionBtnName(action)"
            v-if="showItemAction(item, action.key)"
            small
            outlined
            :btn-label="action.label || $i18n.t('ea.actions.' + action.name)"
            :resource="resource"
            :id="item.id"
            :item="item"
            @action-completed="fetchData"
          />
        </template>

        <slot name="rowActions" :row="item" :resource="resource" :fetch-data="fetchData"></slot>
      </div>
    </template>
    <!-- 根据字段类型渲染 -->
    <template v-for="field in tableFields" v-slot:[`item.${field.source}`]="{ item, value }">
      <slot :name="`field.${field.source}`" v-bind="{ item, value }">
        <ea-field v-if="field.type" :source="field.source" :type="field.type" :value="value" />
        <template v-else>{{ value }}</template>
      </slot>
    </template>
  </v-data-table>
</template>

<script>
import Resource from "@lowcoder/easy-admin/src/mixins/resource"
import CreateButton from "./buttons/CreateButton"
import UpdateButton from "./buttons/UpdateButton"
import ShowButton from "./buttons/ShowButton"
import DeleteButton from "./buttons/DeleteButton"

export default {
  components: { DeleteButton, ShowButton, UpdateButton, CreateButton },
  mixins: [Resource],
  props: {
    multiSort: {
      type: Boolean,
      default: true,
    },
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
    showItemAction: {
      type: Function,
      default: function (item, action) {
        return item && this.$admin.hasActionPermission(this.resource, action)
      },
    },
    hideActions: Boolean,
    hideRowActions: Boolean,
    showSelect: Boolean,
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
      filterExpanded: false,
      filtersExtensionHeight: 100,
    }
  },
  computed: {
    defaultColumnActions() {
      let defaultActionsName = ["show", "update", "delete"]
      return this.currentResource.actions
        .filter((a) => defaultActionsName.includes(a.name))
        .sort((a1, a2) => {
          return defaultActionsName.findIndex((a) => a === a1.name) - defaultActionsName.findIndex((a) => a === a2.name)
        })
    },
    tableFields() {
      return this.fields
        .map((f) => {
          return typeof f === "string" ? { source: f } : f
        })
        .map((f) => {
          return {
            ...f,
            type: f.type || "text",
            label: f.label || this.$admin.getFieldLabel(this.resource, f.labelKey || f.source),
          }
        })
        .filter((f) => f.source)
    },
    filterableFields() {
      return this.tableFields.filter((f) => f.filterable)
    },
    singleDisplayFilterField() {
      if (this.filterableFields) {
        let fieldSourceWeight = (source) => {
          switch (source) {
            case "name":
              return 9
            case "code":
              return 8
            default:
              return 1
          }
        }
        let fieldTypeWeight = (type) => {
          switch (type) {
            case "text":
              return 9
            case "email":
              return 8
            default:
              return 1
          }
        }

        let sorted = [...this.filterableFields].sort((f1, f2) => {
          let aSourceWeight = fieldSourceWeight(f1.source),
            bSourceWeight = fieldSourceWeight(f2.source)
          return aSourceWeight === bSourceWeight
            ? fieldTypeWeight(f1.type) - fieldTypeWeight(f1.type)
            : aSourceWeight - bSourceWeight
        })
        let filteredFields = sorted.filter((f) => Object.keys(this.listParams.filter).includes(f.source))

        if (filteredFields.length > 0) {
          return filteredFields[0]
        }
        if (sorted.length > 0) {
          return sorted[0]
        }

        return null
      }
      return null
    },
    headers() {
      let fields = this.tableFields
        .filter((f) => !f.hide)
        .map((field) => {
          return {
            text: field.label,
            value: field.source,
            sortable: field.sortable,
            align: field.align || this.smartAlign(field),
          }
        })

      if (
        !this.hideRowActions &&
        this.currentResource.actions.some((a) => ["retrieve", "create"].indexOf(a.name) === -1)
      ) {
        fields.push({
          text: this.$i18n.t("ea.column.actions") || "actions",
          value: "actions",
          sortable: false,
          align: "right",
        })
      }

      return fields
    },
  },
  methods: {
    rowActionBtnName(action) {
      if (["delete", "update", "show"].includes(action.name)) {
        return `ea-${action.name}-button`
      }

      return "ea-action-button"
    },
    smartAlign(field) {
      if (["number"].includes(field.type)) {
        return "right"
      }
      return "left"
    },
    handleOptionsUpdate({ sortBy, sortDesc, page, itemsPerPage }) {
      // sort
      let sortParams = []
      let sortFields = sortBy instanceof Array ? sortBy : [sortBy]
      let descArray = sortDesc instanceof Array ? sortDesc : [sortDesc]
      for (let i in sortFields) {
        sortParams.push({
          by: sortFields[i],
          desc: descArray[i] || false,
        })
      }
      this.listParams.sort = sortParams

      // page
      this.listParams.pagination.page = page
      this.listParams.pagination.perPage = itemsPerPage
      this.fetchData()
    },
    async fetchData() {
      this.loading = true
      let { sort, filter, pagination } = this.listParams
      let { data, total } = await this.$store.dispatch(`${this.resource}/getList`, {
        sort,
        filter,
        pagination,
      })

      this.totalItems = total
      this.items = data
      this.loading = false
    },
    handleFilterFieldKeydown(ke) {
      // when keyCode equals 13, exec filter
      if (ke && ke.keyCode === 13) {
        this.handleFilter()
      }
    },
    handleResetFilters() {
      if (this.filter) {
        this.listParams.filter = { ...this.filter }
      } else {
        this.listParams.filter = {}
        this.listParams.pagination.page = 1
      }
      this.fetchData()
    },
    handleFilter() {
      this.fetchData()
    },
    onFiltersWrapperResize() {
      this.filtersExtensionHeight =
        ((this.$refs.filtersWrapper && this.$refs.filtersWrapper.$el.offsetHeight) || 80) + 20
    },
  },
  mounted() {
    this.listParams.pagination.perPage = this.$admin.options.defaultPerPage
    this.fetchData()
  },
  watch: {
    filter: {
      handler(val) {
        if (val) {
          this.listParams.filter = { ...val }
        } else {
          this.listParams.filter = {}
          this.listParams.pagination.page = 1
        }
        this.fetchData()
      },
      immediate: true,
    },
  },
}
</script>

<style scoped lang="sass">
@import '~vuetify/src/styles/styles.sass'

.data-table-row-actions
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

.filters-wrapper
  ::v-deep >*
    max-width: 200px
    margin: 0 $spacer * 2 $spacer * 5 $spacer * 2
</style>
