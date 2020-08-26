<template lang="pug">
.bs-select(:class="classes")
  select(
    :style="{'width': `${width}px`}"
    v-model="setValue"
  )
    option(value="" v-if="!required") {{placeholder}}
    option(
      v-for="item in items" 
      :key="item[val]" 
      :value="item[val]"
    ) {{ item[text] }}
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  onMounted
} from '@vue/composition-api';

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      required: true
    },
    placeholder: {
      type: String,
      default: '選択してください'
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: null,
    },
    val: {
      type: String,
      default: 'value',
    },
    small: {
      type: Boolean,
      default: false
    },
    text: {
      type: String,
      default: 'text'
    },
    width: {
      type: Number,
      default: 300
    }
  },
  setup(props, context) {
    const setValue = computed({
      get: () => props.value,
      set: (value) => context.emit('input', value)
    });
    const classes = computed(() => {
      return [
        'border-light-gray',
        {
          'disabled': props.disabled,
          'small': props.small
        }
      ]
    });
    onMounted(() => {
      if (props.required && !setValue.value) {
        const item:any = props.items[0];
        setValue.value = item[props.val];
      }
    });
    return {
      setValue,
      classes
    }
  }
})
</script>

<style lang="scss">
@import '../../assets/scss/color';

.bs-select {
  border: {
    radius: 5px;
    style: solid;
    width: 1px;
  }
  position: relative;
  > select {
    padding: 0.6em 0.5em;
    position: relative;
    z-index: 1;
  }
  &::before {
    content: '';
    position: absolute;
    right: 0.8em;
    top: 50%;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 6px 4px 0 4px;
    border-color: $light-gray transparent transparent transparent;
    transform: translateY(-50%);
  }
  &.small > select {
    font-size: 0.9em;
    padding: 0.5em;
  }
}
</style>