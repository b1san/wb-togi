<template lang="pug">
transition(name="bs-confirm")
  .bs-confirm(v-if="show" @click.self="show = false")
    .bs-confirm__contents
      .flex.v-center
        font-awesome-icon.font-primary(icon="question-circle")
        p(v-html="message")
      .buttons.align-right
        bs-button(color="gray" small @click="show = false") いいえ
        bs-button(color="primary" small @click="ok") はい
</template>

<script lang="ts">
import {
  defineComponent,
  computed
} from '@vue/composition-api';

export default defineComponent({
  props: {
    message: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const show = computed({
      get: () => props.value,
      set: (value) => context.emit('input', value)
    });
    const ok = () => {
      show.value = false;
      context.emit('ok');
    }
    return {
      show,
      ok
    }
  }
});
</script>

<style lang="scss">
@import '../../assets/scss/color';

.bs-confirm {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  &__contents {
    background: $white;
    border-radius: 5px;
    box-shadow: 2px 2px 4px 2px rgba(0, 0, 0, 0.2);
    position: absolute;
    left: 50%;
    top: 2em;
    padding: 1em;
    min-width: 400px;
    transform: translateX(-50%);
    > *:first-child {
      margin-bottom: 1em;
      > *:first-child {
        font-size: 1.5em;
        margin-right: 0.8em;
      }
      p {
        line-height: 1.5em;
      }
    }
  }
  &-enter-active, &-leave-active {
    transition: all 0.4s;
  }
  &-enter-active > &__contents, &-leave-active > &__contents {
    transition: all 0.4s;
  }
  &-enter > &__contents, &-leave-to > &__contents {
    transform: translate(-50%, -200%);
  }
}
.dark-mode {
  .bs-confirm__contents {
    background: $dark;
  }
}

</style>