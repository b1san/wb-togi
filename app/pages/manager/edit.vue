<template lang="pug">
.edit-page
  .container
    .form
      p.form-label 社員番号
      bs-input(
        v-model="member.code"
        ref="code"
        :rules="rules.code"
        :disabled="origin !== ''"
      )
      p.form-label 名前
      bs-input(
        v-model="member.name"
        ref="name"
        :rules="rules.name"
      )
      p.form-label かな
      bs-input(
        v-model="member.kana"
        ref="kana"
        :rules="rules.kana"
      )
      p.form-label ローマ字
      bs-input(
        v-model="member.roma"
        ref="roma"
        :rules="rules.roma"
      )
      p.form-label 内線
      bs-input(
        v-model="member.exte"
        ref="exte"
        :rules="rules.exte"
      )
      p.form-label 電話番号
      bs-input(
        v-model="member.tel"
        ref="tel"
        :rules="rules.tel"
      )
      p.form-label メールアドレス
      bs-input(
        v-model="member.mail"
        ref="mail"
        :rules="rules.mail"
      )
    .buttons
      bs-button(color="gray" @click="back") 戻る
      bs-button(color="success" @click="edit") 登録
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
  reactive,
  computed,
  onMounted
} from '@vue/composition-api';
import axios from 'axios';
import { Member } from '@/modules/Member';

export default defineComponent({
  setup(props, context) {
    const origin = ref('')
    const member = ref({
      code: '',
      name: '',
      kana: '',
      roma: '',
      tel: '',
      mail: '',
      exte: '',
      comm: '',
      memo: [],
      seat: '',
      status: 0
    } as Member);
    const snackbar = ref({
      show: false,
      icon: 'check',
      color: 'success',
      message: ''
    });
    const rules = reactive({
      code: [
        {validate: (v: string) => !!v, message: '社員番号を入力してください'},
        {validate: (v: string) => v.match(/^[0-9]{5}$/), message: '社員番号は数値5桁で入力してください'}
      ],
      name: [
        {validate: (v: string) => !!v, message: '名前を入力してください'}
      ],
      kana: [
      ],
      roma: [
        {validate: (v: string) => v.match(/^[a-zA-Z ]*$/), message: 'ローマ字は英字を入力してください'}
      ],
      exte: [
        {validate: (v: string) => v.match(/^[0-9]*$/), message: '内線は数字を入力してください'}
      ],
      tel: [
        {validate: (v: string) => v.match(/^[0-9-]*$/), message: '電話番号は数字、ハイフンを入力してください'}
      ],
      mail: [
        {validate: (v: string) => !v || v.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/), message: 'メールアドレスを正しく入力してください'}
      ]
    });
    const validate = () => {
      const ctx:any = context;
      return ctx.refs.code.validate() &
             ctx.refs.name.validate() &
             ctx.refs.kana.validate() &
             ctx.refs.roma.validate() &
             ctx.refs.exte.validate() &
             ctx.refs.tel.validate() &
             ctx.refs.mail.validate();
    };
    const edit = async () => {
      if (!validate()) {
        return;
      }
      let response;
      if (origin.value === '') {
        response = await axios.put('/api/member', member.value).catch(error => {
          return error.response;
        });
      } else {
        response = await axios.post('/api/member', member.value).catch(error => {
          return error.response;
        });
      }
      switch (response.status) {
        case 200:
          snackbar.value = {
            show: true,
            message: '登録に成功しました',
            color: 'success',
            icon: 'check-circle'
          };
          origin.value = member.value.code;
          break;
        case 409:
          snackbar.value = {
            show: true,
            message: '社員コードが重複しています',
            color: 'danger',
            icon: 'exclamation-triangle'
          };
          break;
        default:
          snackbar.value = {
            show: true,
            message: '登録に失敗しました',
            color: 'danger',
            icon: 'exclamation-triangle'
          };
      }     
    };
    const back = () => {
      context.root.$router.go(-1);
    };
    onMounted(async () => {
      const code = context.root.$route.query.code;
      if (code) {
        const response = await axios.get(`/api/member/${code}`).catch(error => {
          return error.response;
        });
        if (response.status !== 200 || !response.data) {
          //TODO error process
          return
        }
        member.value = response.data;
        origin.value = response.data.code;
      }
    });
    return {
      origin,
      member,
      snackbar,
      rules,
      back,
      edit
    }
  }
});
</script>

<style lang="scss">
.edit-page {
  .container {
    padding: 30px;
    max-width: 640px;
  }
  .buttons {
    text-align: right;
  }
}
</style>