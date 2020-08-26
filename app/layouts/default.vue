<template lang="pug">
.layout(:class="{'dark-mode' : dark}" v-if="loaded")
  header.flex.v-center.h-between(:class="{'dark' : dark, 'primary' : !dark}")
    h1(@click="toRoot") GIT座席表
    bs-toggle(v-model="dark")
  main(:class="{'black' : dark, 'white' : !dark}")
    nuxt
</template>

<script lang="ts">
import { 
  defineComponent, 
  ref,
  watch,
  onMounted
} from '@vue/composition-api';

export default defineComponent({
  setup(props, context) {
    const dark = ref(false);
    const loaded = ref(false);
    const toRoot = () => {
      context.root.$router.push('/');
    };
    watch(dark, (newVal) => {
      localStorage.setItem('mode', newVal ? '1' : '0');
    });
    onMounted(() => {
      dark.value = localStorage.getItem('mode') === '1';
      context.root.$nextTick(() => {
        loaded.value = true;
      });
    });
    return {
      dark,
      loaded,
      toRoot
    }
  }
})
</script>

<style lang="scss">
.layout {
  min-width: 1080px;
  header {
    height: 55px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0 20px;
    h1 {
      font-size: 1.3em;
      cursor: pointer;
    }
  }
  main > * {
    min-height: calc(100vh - 55px);
    height: 100%;
  }
}
</style>