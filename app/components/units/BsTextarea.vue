<template lang="pug">
.bs-textarea(
  :class="classes"
  :style="{'width': !!width ? `${width}px` : '100%'}"
)
  textarea(
    v-model="setValue"
    :class="colors.border"
    :disabled="disabled"
    :maxlength="maxlength"
    :style="styles"
    ref="textarea"
    @focus="focused = true"
    @blur="() => {validate(); focused=false;}"
  )
  .bs-textarea__footer.flex.h-between
    p.bs-textarea__message(
      :class="{'font-danger': result.error}"
    ) {{result.message}}
    p.bs-textarea__counter {{counter}}
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
  name: 'BsTextarea',
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
    height: {
      type: Number,
      default :300
    },
    maxheight: {
      type: Number,
      default: 600
    },
    maxlength: {
      type: Number,
      default: null
    },
    message: {
      type: String,
      default :''
    },
    resize: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: null
    },
    value: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: null
    }
  },
  setup(props, context) {
    //data properties
    const focused = ref(false);
    const validation = reactive({
      error: false,
      message: ''
    });
    //Computed propertries 
    const counter = computed(() => {
      if (!props.count) {
        return '';
      }
      if (props.maxlength > 0) {
        return `${setValue.value.length}/${props.maxlength}`
      }
      return `${setValue.value.length}文字`;
    });
    const result = computed(() => {
      return {
        error: validation.error || props.error,
        message: validation.message ? validation.message : props.message
      }
    })
    const setValue = computed({
      get: () => props.value, 
      set: (value) => context.emit('input', value)
    });
    const classes = computed(() => {
      return {
        'disabled': props.disabled,
      }
    });
    const styles = computed(() => {
      return {
        'min-height': `${props.height}px`,
        'height': `${props.height}px`, 
        'max-height': !!props.maxheight ? `${props.maxheight}px` : null,
        'resize': props.resize ? 'vertical' : 'none'
      }
    });
    const colors = computed(() => {
      if (result.value.error) {
        return {
          border: 'border-danger'
        };
      } else if (focused.value) {
        return {
          border: `border-${props.color}`
        }
      } else {
        return {
          border: `border-light-gray`
        }
      }
    });
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
    const focus = ():void => {
      const ctx: any = context;
      ctx.refs.textarea.focus();
    }
    const blur = ():void => {
      const ctx: any = context;
      ctx.refs.textarea.blur();
    }
    const reset = (): void => {
      setValue.value = ''
      blur();
      context.root.$nextTick(() => {
        validation.error = false
        validation.message = ''
      })
    }
    watch(() => setValue.value, (_new, _prev) => {applyRules(_new)})
    return {
      focused,
      result,
      counter,
      setValue,
      classes,
      styles,
      colors,
      validate,
      focus,
      blur,
      reset
    }
  }
})


</script>

<style lang="scss">
.bs-textarea {
  textarea {
    border: {
      radius: 5px;
      style: solid;
      width: 1px;
    }
    padding: 10px;
    width: 100%;
  }
  &__footer {
    font-size: 0.7em;
    padding: 2px;
    line-height: 16px;
    height: 16px;
  }
}
</style>