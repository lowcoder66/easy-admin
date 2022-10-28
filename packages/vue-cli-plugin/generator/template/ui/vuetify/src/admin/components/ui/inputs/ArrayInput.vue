<template>
  <div class="mb-4 ea-array-input">
    <div class="d-flex justify-space-between" >
      <div class="v-label my-2">{{ inputLabel }}</div>
      <v-btn v-if="!readonlyInput" small text color="primary" @click="add" >
        <v-icon left>mdi-plus</v-icon><span>{{ $t('ea.actions.add') }}</span>
      </v-btn>
    </div>

    <div>
      <v-divider ></v-divider>
      {{ input && input.length > 0 ? $t('ea.array.count', {count: input.length})  : $t('ea.array.empty') }}
    </div>

    <div class="pl-3" >
      <v-card v-for="(item, i) in input" :key="item.id" class="my-2" outlined>
        <v-card-subtitle>{{ inputLabelWithoutRequiredTag + '#' + (i + 1)}}</v-card-subtitle>
        <div class="px-4">
          <slot
              :item="item"
              :parent-source="source"
              :index="i"
          ></slot>
        </div>

        <v-card-actions  v-if="!readonlyInput">
          <v-spacer></v-spacer>
          <v-btn small text color="error" @click="remove(i)" >
            <v-icon left>mdi-close</v-icon><span>{{ $t('ea.actions.remove') }}</span>
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>

<script>
import Input from "@lowcoder66/easy-admin/src/mixins/input"

export default {
  mixins: [Input],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    add() {
      this.input.push({ _id: Math.max(...this.input.map((o) => o._id)) + 1 });
      this.update(this.input);
    },
    remove(index) {
      this.input.splice(index, 1);
      this.update(this.input);
    },
  },
};
</script>

<style lang="scss">

</style>