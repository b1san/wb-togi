<template lang="pug">
button(
  :class="['bs-button', color, classes]"
  :disabled="disabled"
  :type="submit ? 'submit' : null"
  @click="onClick"
)
  slot
</template>

<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';

export default defineComponent({
  props: {
    block: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'dark'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Boolean,
      default: false
    },
    large: {
      type: Boolean,
      default: false
    },
    outlined: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    submit: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const onClick = () => {
      if (!props.disabled) {
        context.emit('click')
      }
    }
    const classes = computed(() => {
      return {
        block: props.block,
        disabled: props.disabled,
        icon: props.icon,
        large: props.large,
        outlined: props.outlined,
        small: props.small
      }
    })
    return {
      onClick,
      classes
    }
  }
})
</script>

<style lang="scss">
.bs-button {
  border-radius: 3px;
  box-shadow: 0px 2px 1px 0px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  padding: 10px 15px;
  text-align: center;
  transition: 0.2s all;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    box-shadow: none;
    opacity: 0.7;
  }
  &.large {
    font-size: 16px;
    padding: 15px 18px;
  }
  &.small {
    font-size: 12px;
    padding: 8px 10px;
  }
  &.outlined, &.disabled {
    box-shadow: none;
  }
  &.icon {
    border-radius: 50%;
    font-size: 18px;
    text-align: center;
    height: 50px;
    width: 50px;
    &.large {
      font-size: 24px;
      height: 60px;
      width: 60px;
    }
    &.small {
      font-size: 14px;
      height: 31px;
      width: 31px;
    }
  }
}
</style>