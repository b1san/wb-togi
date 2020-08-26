<template lang="pug">
.bs-input(
  :class="classes"
  :style="styles"
)
  .bs-input__input.flex.v-center(
    :class="colors.border"
  )
    .bs-input__icon(
      v-if="icon"
      :class="colors.icon"
    )
      font-awesome-icon(:icon="icon")
    input(
      ref="input"
      :disabled="disabled"
      :type="type"
      :placeholder="placeholder"
      v-model="setValue"
      @change="onChange"
      @focus="focused = true"
      @blur="blurValidate"
      @keypress.enter="enter"
    )
  .bs-input__footer.flex.h-between(v-if="!nomessage")
    p.bs-input__message(
      :class="{'font-danger': result.error}"
    ) {{result.message}}
    p.bs-input__count {{counter}}
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  reactive,
  watch
} from '@vue/composition-api';

export default defineComponent({
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    count: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default: ''
    },
    nomessage: {
      type: Boolean,
      default: false
    },
    numberOnly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: null
    },
    selfvalidate: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: [String, Number],
      default: '',
    },
    width: {
      type: Number,
      default: 0
    }
  },
  setup(props, context) {
    //Data properties 
    let focused = ref(false)
    const validation = reactive({
      error: false,
      message: ''
    });
    //Computed propertries 
    const result = computed(() => {
      return {
        error: validation.error || props.error,
        message: validation.message ? validation.message : props.message
      }
    })
    const setValue = computed({
      get: () => props.value as string,
      set: (value: string | number | null) => {
        context.emit('input', value);
      }
    });
    const counter = computed(() => {
      if (!props.count) {
        return ''
      }
      if (props.maxlength > 0) {
        return `${setValue.value.length}/${props.maxlength}`
      }
      return `${setValue.value.length}文字`
    })
    const classes = computed(() => {
      return {
        'disabled': props.disabled,
        'small': props.small
      }
    });
    const styles = computed(() => {
      return {
        'width': props.width === 0 ? '100%' : `${props.width}px`
      }
    });
    const colors = computed(() => {
      if (result.value.error) {
        return {
          border: 'border-danger',
          icon: 'font-danger',
        }
      } else if (focused.value) {
        return {
          border: `border-${props.color}`,
          icon: `font-${props.color}`,
        }
      } else {
        return {
          border: 'border-light-gray',
          icon: '',
        }
      }
    });
    //methods
    const onChange = () => {
      context.emit('change');
    }
    const applyRules = (value: string):boolean => {
      if (props.rules) {
        for (const rule of props.rules) {
          const r: any = rule;
          if (!r.validate(value)) {
            validation.error = true
            validation.message = r.message
            return false
          }
        }
        validation.error = false
        validation.message = ''
      }
      return true
    }
    const validate = ():boolean => {
      return applyRules(setValue.value)
    }
    const blurValidate = ():void => {
      if (!props.selfvalidate) {
        validate();
      } else {
        reset();
      }
      focused.value = false;
    }
    const focus = ():void => {
      const ctx: any = context;
      ctx.refs.input.focus();
    }
    const blur = ():void => {
      const ctx: any = context;
      ctx.refs.input.blur();
    }
    const enter = ():void => {
      context.emit('enter');
    }
    const reset = (): void => {
      setValue.value = ''
      blur();
      context.root.$nextTick(() => {
        validation.error = false
        validation.message = ''
      })
    }
    watch(() => setValue.value, (_new, _prev) => {
      if (props.numberOnly && !_new.match(/^[0-9]*$/)) {
        _new = _new.slice(0, -1)
      }
      if (props.maxlength && setValue.value.length > props.maxlength) {
        setValue.value = _new.slice(0, -1)
      } else {
        setValue .value = _new
      }
      if (!props.selfvalidate) {
        applyRules(setValue.value)
      }
    })
    return {
      focused,
      result,
      counter,
      setValue,
      classes,
      styles,
      colors,
      onChange,
      validate,
      blurValidate,
      focus,
      blur,
      enter,
      reset
    }
  }
})
</script>

<style lang="scss">
.bs-input {
  text-align: left;
  &__icon {
    padding: {
      left: 10px;
      right: 10px;
    }
  }
  &__input {
    border: {
      radius: 5px;
      style: solid;
      width: 1px;
    }
    transition: border 0.2s;
    > input {
      padding: 0.6em 0.5em;
      position: relative;
      width: 100%;
      z-index: 1;
      &::placeholder {
        color: #ccc;
      }
      &[type="number"]::-webkit-outer-spin-button,  
      &[type="number"]::-webkit-inner-spin-button {  
        -webkit-appearance: none;  
        margin: 0;  
      }  
    }
  }
  &__footer {
    font-size: 0.7em;
    line-height: 16px;
    height: 16px;
    padding: 2px;
  }
  &.small > &__input {
    > input {
      font-size: 0.9em;
      padding: 0.5em;
    }
  }
}
</style>