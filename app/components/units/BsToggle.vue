<template lang="pug">
.bs-toggle(
  :class="{'disabled': disabled}"
  @click="toggle"
)
  .flex.v-center
    .bs-toggle__label(v-if="label") {{label}}
    .bs-toggle__button(
      :class="classes"
    )
</template>

<script lang="ts">
import {
  defineComponent,
  computed
} from '@vue/composition-api';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: null
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const classes = computed(() => {
      const color = props.value ? props.color : 'light-gray';
      return [color, {
        'toggle': props.value
      }]
    });
    const toggle = () => {
      if (!props.disabled) {
        context.emit('input', !props.value)
      }
    }
    return {
      classes,
      toggle
    }
  }
})
</script>

<style lang="scss">
@import '../../assets/scss/color';

.bs-toggle {
  display: inline-block;
  cursor: pointer;
  &__label {
    font-size: 0.8em;
  }
  &__button {
    border-radius: 1em;
    height: 1.5em;
    position: relative;
    width: 3em;
    transition: all 0.2s;
    margin: {
      left: 0.5em;
    }
    &::before {
      content: '';
      background: $white;
      border-radius: 50%;
      width: 1.3em;
      height: 1.3em;
      position: absolute;
      top: 0.1em;
      left: 0.1em;
      transition: all 0.2s;
    }
    &.toggle::before {
      left: 1.6em;
    }
  }
}
</style>