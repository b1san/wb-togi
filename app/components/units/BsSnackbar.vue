<template lang="pug">
transition(name="bs-snackbar")
  .bs-snackbar.flex.v-center.dark(
    v-if="show" 
    :class="position"
  )
    .bs-snackbar__icon(
      v-if="!!icon"
      :class="`font-${color}`"
    )
      font-awesome-icon(:icon="icon")
    p.bs-snackbar__message.flex-1 {{message}}
    .bs-snackbar__action
      span(class="font-success" @click="show = false") OK
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  watch
} from '@vue/composition-api';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'dark',
    },
    icon: {
      type: String,
      default: null
    },
    message: {
      type: String,
      default: ''
    },
    showsec: {
      type: Number,
      default: 5
    },
    position: {
      type: String,
      default: 'top',
      validator: (v: string) => ['top', 'bottom'].indexOf(v) !== -1
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const interval:any = ref(undefined);
    const show = computed({
      get: () => props.value,
      set: (value) => context.emit('input', value) 
    });
    watch(show, (_new, _old) => {
      if (_new) {
        if (interval.value) {
          clearInterval(interval.value);
        }
        interval.value = setInterval(() => {
          show.value = false
        }, props.showsec * 1000);
      } else {
        clearInterval(interval.value);
      }
    })
    return {
      show
    }
  }
})
</script>

<style lang="scss">
.bs-snackbar {
  border-radius: 5px;
  box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
  position: fixed;
  padding: 15px 10px;
  font-size: 0.9em;
  min-width: 400px;
  z-index: 1000;
  &.top {
    top: 2em;
    left: 50%;
    transform: translateX(-50%);
  }
  &.bottom {
    bottom: 2em;
    left: 50%;
    transform: translateX(-50%);
  }
  &__icon {
    margin-right: 1em;
  }
  &__action {
    > span {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      cursor: pointer;
      font: {
        size: 0.8em;
        weight: bold;
      }
      padding: 8px 8px;

    }
  }
  &-enter-active, &-leave-active {
    transition: all 0.2s;
  }
  &-enter.top, &-leave-to.top {
    transform: translateX(-50%) translateY(-200%) !important;
  }
  &-enter.bottom, &-leave-to.bottom {
    transform: translateX(-50%) translateY(200%) !important;
  }
}
</style>