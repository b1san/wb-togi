<template lang="pug">
.seat-item
  template(v-if="member")
    .seat-contents(
      @click="openInfo"
    )
      .flex.v-center.h-between
        p.label(:class="`status${member.status}`") {{status.attr}}
        p.exte.align-left {{member.exte}}
      p.name(:tooltip="member.comm") {{member.name}}
    .info-dialog.flex.v-center.h-center(
      v-if="state.showInfo" 
      @click.self.stop="state.showInfo = false"
    )
      .info-dialog__contents
        .info-header.flex.h-between.v-center
          p {{member.code}}　{{member.name}}
          p.remove(@click="resetSeat") 設定解除
        .info-base
          p.selectable
            span 内線
            span {{member.exte}}
          p.selectable
            span Tel
            span {{member.tel}}
          p.selectable
            span E-Mail
            span {{member.mail}}
          p.word-break-normal
            span 行先・戻り
            span {{member.comm}}
        .info-status
          .info-status__select
            div(
              v-for="s in statuses" 
              :key="s.status" 
              :class="`status${s.status}`"
              @click="setStatus(s.status)"
            )
              span(v-html="s.text")
          bs-input(v-model="state.comment" placeholder="行先・戻り" nomessage)
  template(v-else)
    .seat-contents.flex.v-center.h-center(@click.self="editSeat")
      form.setting-seat(v-if="state.showSetting" @submit.prevent="setSeat")
        bs-input(v-model="state.code" nomessage placeholder="社員番号" ref="vacant")
</template>

<script lang="ts">
import {
  defineComponent,
  computed,
  ref,
  reactive
} from '@vue/composition-api';

export default defineComponent ({
  props: {
    position: {
      type: String,
      required: true
    },
    member: {
      type: Object,
      default: null
    }
  },
  setup(props, context) {
    const state = reactive({
      code: '',
      showSetting: false,
      showInfo: false,
      comment: '',
      memo: ''
    });
    const statuses = reactive([
      { status:  1, attr: '在', text: '在席' },
      { status:  2, attr: '退', text: '退社' },
      { status:  3, attr: '会', text: '会議' },
      { status:  4, attr: '内', text: '社内' },
      { status:  5, attr: '客', text: '接客' },
      { status:  6, attr: '遅', text: '遅刻<br>早退' },
      { status:  7, attr: '出', text: '出張' },
      { status:  8, attr: '休', text: '休み' },
      { status:  9, attr: '外', text: '外出' },
      { status:  0, attr: '未', text: '未出社' },
      { status: 10, attr: '他', text: 'その他' },
      { status: 11, attr: '宅', text: '在席<br>勤務' },
    ]);
    const status = computed(() => {
      return statuses.filter(e => e.status === props.member.status)[0];
    });
    const editSeat = () => {
      state.code = '';
      state.showSetting = !state.showSetting;
      context.root.$nextTick(() => {
        if (state.showSetting) {
          const ctx:any = context;
          ctx.refs.vacant.focus();
        }
      })
    }
    const setSeat = () => {
      context.emit('seat', {code: state.code, seat: props.position});
      state.showSetting = false;
    }
    const resetSeat = () => {
      context.emit('seat', {code: props.member.code, seat: ''});
      state.showInfo = false;
    }
    const openInfo = () => {
      state.comment = '';
      state.memo = '';
      state.showInfo = true;
    }
    const setStatus = (status: number) => {
      context.emit('status', {code: props.member.code, comm: state.comment, status: status});
      state.showInfo = false;
    }
    return {
      state,
      statuses,
      status,
      editSeat,
      setSeat,
      resetSeat,
      openInfo,
      setStatus
    }
  }
})
</script>

<style lang="scss">
@import '../../assets/scss/color';

.seat-item {
  width: 100%;
  height: 100%;
  .seat-contents {
    width: 100%;
    height: 100%;
    padding: 0.5em;
    .exte {
      font-weight: bold;
    }
    .name {
      margin-top: 1em;
      font-weight: bold;
    }
    .label {
      text-align: center;
      padding: 0.3em;
      font-weight: bold;
      border-radius: 3px;
    }
    [tooltip] {
      position: relative;
    }
    [tooltip]::before {
      content: attr(tooltip);
      position: absolute;
      left: 0;
      top: calc(100% + 5px);
      font-size: 0.7em;
      background: rgba(0, 0, 0, 0.6);
      color: $white;
      padding: 0.8em;
      text-align: left;
      border-radius: 3px;    
      width: 120px;
      display: none;
      word-break: normal; 
      overflow: hidden; 
      text-overflow: ellipsis; 
      white-space: nowrap;
    }
    [tooltip]:hover::before {
      display: block;
    }
    [tooltip='']::before {
      display: none !important;
    }
  }
  .info-dialog {
    background: rgba(0, 0, 0, 0.2);
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    left: 0;
    z-index: 1000;
    &__contents {
      background: $white;
      box-shadow: 3px 3px 6px 0 rgba(0, 0, 0, 0.2);
      border-radius: 3px;
      max-width: 480px;
      > *:not(:first-child) {
        padding: 1.2em;
      }
    }
  }
  .info-header {
    background: $primary;
    color: $white;
    padding: 0.4em 0.5em;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    .remove {
      font-size: 0.8em;
      padding: 6px;
      border-radius: 3px;
      cursor: pointer;
      background: rgba(0, 0, 0, 0.3);
    }
  }
  .info-base {
    p {
      &:not(:last-child) {
        margin-bottom: 0.3em;
      }
      > span:first-child {
        background: #e6e6e6;
        font-size: 0.9em;
        display: inline-block;
        padding: 0.2em;
        border-radius: 3px;
        margin-right: 0.5em;
      }
    }
  }
  .info-status {
    margin-top: -1.2em;
    &__select {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      margin-bottom: 1em;
      > * {
        width: 70px;
        height: 70px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.3em;
        font-weight: bold;
        cursor: pointer;
        margin: {
          left: -1px;
          bottom: -1px;
        }
        transition: opacity 0.2s;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .info-memo {
    p {
      margin-bottom: 0.5em;
    }
    .bs-button {
      text-align: right;
    }
  }
  .status0 { background: #90A4AE; color: #ffffff; }
  .status1 { background: #00796B; color: #ffffff; }
  .status2 { background: #37474F; color: #ffffff; }
  .status3 { background: #388E3C; color: #ffffff; }
  .status4 { background: #29B6F6; color: #ffffff; }
  .status5 { background: #66BB6A; color: #ffffff; }
  .status6 { background: #EF5350; color: #ffffff; }
  .status7 { background: #F57C00; color: #ffffff; }
  .status8 { background: #F48FB1; color: #ffffff; }
  .status9 { background: #FFB300; color: #ffffff; }
  .status10 { background: #7B1FA2; color: #ffffff; }
  .status11 { background: #3F51B5; color: #ffffff; }
}

.dark-mode {
  .info-dialog__contents {
    background: $dark;
    .info-base {
      span:first-child {
        background: $gray;
      }
    }
    .info-header {
      background: $gray;
    }
  }
}
</style>