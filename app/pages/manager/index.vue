<template lang="pug">
.manager-page
  .container
    .header.flex.v-center
      bs-input(
        v-model="search"
        icon="search"
        placeholder="名前で検索"
        nomessage
        :width="400"
      )
      .create-button
        bs-button(color="primary" @click="create") 
          font-awesome-icon(icon="plus")
          span  新規作成
    .list.flex.wrap.scroll
      .card.flex.v-center.h-between.border-light-gray(
        v-for="(m, i) in list" 
        :key="i"
      ) 
        p {{m.name}}
        div
          bs-button(color="success" icon small @click="edit(m.code)")
            font-awesome-icon(icon="edit")
          bs-button(color="danger" icon small @click="remove(m.code)")
            font-awesome-icon(icon="trash-alt")
  bs-snackbar(
    v-model="snackbar.show"
    :message="snackbar.message"
    :icon="snackbar.icon"
    :color="snackbar.color"
  )
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted
} from '@vue/composition-api';
import axios from 'axios';
import { Member } from '@/modules/Member';

export default defineComponent({
  setup(props, context) {
    const member = ref([]);
    const search = ref('');
    const snackbar = ref({
      show: false,
      icon: '',
      color: 'success',
      message: ''
    });
    const list = computed(() => {
      const r = search ? member.value.filter((e: Member) => {
        return e.name.indexOf(search.value) >= 0 ||
               e.kana.indexOf(search.value) >= 0 ||
               e.roma.toUpperCase().indexOf(search.value.toUpperCase()) >= 0;
      }) : member.value;
      return r.sort((a: Member, b: Member) => {
        return a.kana >= b.kana ? 1 : -1; 
      });
    });
    const fetch = async () => {
      const response = await axios.get('/api/member').catch(error => {
        return error.response;
      });
      if (response.status !== 200) {
        snackbar.value = {
          show: true,
          message: 'データの取得に失敗しました',
          color: 'danger',
          icon: 'exclamation-triangle'
        };
        return
      }
      member.value = response.data;
    };
    const create = ():void => {
      context.root.$router.push('/manager/edit');
    };
    const edit = (code: string):void => {
      context.root.$router.push(`/manager/edit?code=${code}`);
    };
    const remove = async (code: string) => {
      const target:any = member.value.filter((e: Member) => e.code === code)[0];
      const result = window.confirm(`${target.name}の情報を削除します。よろしいですか？`);
      if (result) {
        const response = await axios.delete(`/api/member/${code}`).catch(error => {
          return error.response;
        });
        if (response.status !== 200) {
          snackbar.value = {
            show: true,
            message: '削除に失敗しました',
            color: 'danger',
            icon: 'exclamation-triangle'
          };
          return;
        }
        snackbar.value = {
          show: true,
          message: '削除に成功しました',
          color: 'success',
          icon: 'check-circle'
        };
        fetch();
      }
    };
    onMounted(async () => {
      await fetch();
    });
    return {
      search,
      snackbar,
      list,
      create,
      edit,
      remove
    }
  }
});
</script>

<style lang="scss">
.manager-page {
  .container {
    padding: 30px;
  }
  .header {
    margin-bottom: 30px;
    .create-button {
      margin-left: 2em;
    }
  }
  .card {
    padding: 1.2em;
    border: {
      style: solid;
      width: 1px;
      radius: 3px;
    }
    margin-bottom: 1em;
    width: 240px;
    &:not(:last-child) {
      margin-right: 1em;
    }
    p {
      font-size: 1.2em;
      margin-right: 1em;
    }
    div {
      > *:first-child {
        margin-right: 0.6em;
      }
    }
  }
}
</style>