<template lang="pug">
.bs-table
  table
    thead
      tr.border-light-gray
        th(
          v-for="(header, h) in headers"
          :key="h"
          :class="{'sortable': header.sortable}"
          @click="sort(h + 1)"
        ) 
          span {{ header.text }}
          font-awesome-icon(
            v-if="h + 1 === Math.abs(sortIndex)" 
            :icon="sortIndex > 0 ? 'arrow-down' : 'arrow-up'"
          )
        th(v-if="editable")
        th(v-if="removable")
    tbody
      tr.border-light-gray(
        v-for="(item, i) in rows"
        :key="i"
      )
        td(
          v-for="(header, h) in headers"
          :key="h"
          :style="header | style"
        )  {{ item[header.value] }}
        td.icon(v-if="editable")
          font-awesome-icon(icon="edit" @click="edit(i)")
        td.icon(v-if="removable")
          font-awesome-icon(icon="trash-alt" @click="remove(i)")
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref
} from '@vue/composition-api';

export default defineComponent({
  props: {
    editable: {
      type: Boolean,
      required: false
    },
    removable: {
      type: Boolean,
      required: false
    },
    items: {
      type: Array,
      required: true
    },
    headers: {
      type : Array,
      required: true
    },
    itemkey: {
      type: String,
      default: null
    },
    wordover: {
      type: Boolean,
      default: false
    }
  },
  filters: {
    style: (obj: any) => {
      return {
        'text-align': obj.align ? obj.align : 'left',
        'width': obj.width ? `${obj.width}px` : null
      }
    }
  },
  setup(props, context) {
    const sortIndex = ref(0);
    const rows = computed(() => {
      const items: Array<any> = JSON.parse(JSON.stringify(props.items));
      if (sortIndex.value === 0) {
        return items;
      }
      const header: any = props.headers[Math.abs(sortIndex.value) - 1];
      return items.sort((a: any, b: any) => {
        if (a[header.value] < b[header.value]) {
          return -1 * sortIndex.value
        } else if (a[header.value] > b[header.value]) {
          return 1 * sortIndex.value
        }
        return 0
      })
    })
    const edit = (index: number) => {
      const item: any = rows.value[index];
      context.emit('edit', item[props.itemkey]);
    };
    const remove = (index: number) => {
      const item: any = rows.value[index];
      context.emit('remove', item[props.itemkey]);
    };
    const sort = (index: number) => {
      const header: any = props.headers[index - 1];
      if (header.sortable) {
        sortIndex.value = sortIndex.value === index ? -1 * index : index;
      }
    };
    return {
      sortIndex,
      rows,
      edit,
      remove,
      sort
    }
  }
})
</script>

<style lang="scss">
.bs-table {
  width: 100%;
  table {
    width: 100%;
    thead {
      tr {
        border-bottom-width: 2px;
      }
      th {
        padding: 15px 5px;
        &.sortable {
          cursor: pointer;
          transition: background 0.2s;
          &:hover {
            background: rgba(75, 75, 75, 0.1);
          }
        }
        > * + * {
          margin-left: 0.5em;
        }
      }
    }
    tbody {
      tr {
        border-bottom-width: 1px;
        &:last-child {
          border-bottom-width: 0px;
        }
      }
      td {
        padding: 15px 5px;
        &.icon {
          width: 45px;
          text-align: center;
          & > * {
            cursor: pointer;
            transition: opacity 0.2s;
            &:hover {
              opacity: 0.7;
            }
          }
        }
      }
    }
    tr {
      border-bottom-style: solid;
    }
  }
}
</style>