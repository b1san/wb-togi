<template lang="pug">
.main-page
  .seats
    .seat(v-for="s in seats" :key="s" :class="s")
      seat(:position="s" :member="findMember(s)" @seat="updateSeat" @status="updateStatus")
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
  onMounted
} from '@vue/composition-api';
import axios from 'axios';
import { Member } from '@/modules/Member';
import { w3cwebsocket } from 'websocket';

interface Status {
  code: string,
  comm: string,
  status: number
}

interface Seat {
  code: string,
  seat: string
}

export default defineComponent({
  setup(props, context) {
    const member = ref([]);
    const socket = ref(new w3cwebsocket('ws://localhost:4000/ws'));
    const seats = reactive([
      'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8',
      'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7',
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 
      'd1', 'e1', 'e2', 'e3', 'e4'
    ])
    const snackbar = ref({
      show: false,
      message: '',
      icon: '',
      color: 'danger'
    });
    //methods
    const showSnackbar = (type: string, message: string): void => {
      if (type === 'success') {
        snackbar.value.color = 'success';
        snackbar.value.icon = 'check-circle'
      } else if (type === 'error') {
        snackbar.value.color = 'danger';
        snackbar.value.icon = 'exclamation-triangle'
      }
      snackbar.value.message = message;
      snackbar.value.show = true;
    };
    const findMember = (seat: string): Member | null => {
      const index = member.value.findIndex((e: Member) => e.seat === seat);
      return index >= 0 ? member.value[index] : null;
    };
    const fetch = async () => {
      const response = await axios.get('/api/member').catch(error => {
        return error.response;
      });
      if (response.status !== 200) {
        showSnackbar('error', 'データの取得に失敗しました');
        return;
      }
      member.value = response.data;
    };
    const updateStatus = async (params: Status) => {
      const response = await axios.post('/api/status', params).catch(error => {
        return error.response;
      });
      if (response.status !== 200) {
        showSnackbar('error', 'データの更新に失敗しました');
        return;
      }
      socket.value.send('');
    };
    const updateSeat = async (params: Seat) => {
      const response = await axios.post('/api/seat', params).catch(error => {
        return error.response;
      });
      if (response.status !== 200) {
        showSnackbar('error', 'データの更新に失敗しました');
        return;
      }
      socket.value.send('');
    }
    onMounted(async () => {
      await fetch();
      socket.value.onmessage = (e:any) => {
        member.value = JSON.parse(e.data);
      }
    });
    return {
      member,
      seats,
      snackbar,
      findMember,
      updateStatus,
      updateSeat
    }
  }
});
</script>

<style lang="scss">
@import '../assets/scss/color';

.main-page {
  .seats {
    height: 100%;
    padding: 50px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 60px 1fr;
    grid-template-rows: repeat(4, calc((100vh - 155px)/4));
    grid-template-areas:
      "c1 c2 c3 .. c4 c5 c6 c7 d1 .. e1"
      "b1 b2 b3 .. b4 b5 b6 b7 d1 .. e2"
      ".. .. .. .. .. .. .. .. .. .. e3"
      "a1 a2 a3 a4 a5 a6 a7 a8 .. .. e4"
  }
  .seat {
    border: 1px solid $light-gray;
    margin-left: -1px;
    margin-bottom: -1px;
    &.a1 { grid-area: a1; }
    &.a2 { grid-area: a2; }
    &.a3 { grid-area: a3; }
    &.a4 { grid-area: a4; }
    &.a5 { grid-area: a5; }
    &.a6 { grid-area: a6; }
    &.a7 { grid-area: a7; }
    &.a8 { grid-area: a8; }
    &.b1 { grid-area: b1; }
    &.b2 { grid-area: b2; }
    &.b3 { grid-area: b3; }
    &.b4 { grid-area: b4; }
    &.b5 { grid-area: b5; }
    &.b6 { grid-area: b6; }
    &.b7 { grid-area: b7; }
    &.c1 { grid-area: c1; }
    &.c2 { grid-area: c2; }
    &.c3 { grid-area: c3; }
    &.c4 { grid-area: c4; }
    &.c5 { grid-area: c5; }
    &.c6 { grid-area: c6; }
    &.c7 { grid-area: c7; }
    &.d1 { grid-area: d1; }
    &.e1 { grid-area: e1; }
    &.e2 { grid-area: e2; }
    &.e3 { grid-area: e3; }
    &.e4 { grid-area: e4; }
  }
  .side {
    border-left: 1px solid $light-gray;
    width: 300px;
  }
}
</style>